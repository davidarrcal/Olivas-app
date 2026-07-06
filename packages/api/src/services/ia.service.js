const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'nvidia/nemotron-3-super-120b-a12b:free';

const iaContextService = require('./ia-context.service');
const iaToolsService = require('./ia-tools.service');
const iaConversationService = require('./ia-conversation.service');

async function chat(req, res) {
  const { mensaje, contextoPantalla, entidadId, conversacionId } = req.body;
  const userId = req.user.id;

  if (!mensaje || !mensaje.trim()) {
    return res.status(400).json({ error: 'Mensaje vacio' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY no configurada' });
  }

  try {
    const contexto = await iaContextService.buildContext({ userId, contextoPantalla: contextoPantalla || 'global', entidadId });
    const historial = await iaConversationService.getHistorial(conversacionId, userId);
    const tools = iaToolsService.getToolsForContext(contextoPantalla || 'global');

    const messages = [
      { role: 'system', content: contexto.systemPrompt },
      ...historial,
      { role: 'user', content: mensaje }
    ];

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    let convId = conversacionId;
    let fullContent = '';
    let toolCallsAccum = {};
    let totalTokensIn = 0;
    let totalTokensOut = 0;

    const result = await callOpenRouter(messages, tools, true, res);

    fullContent = result.content;
    toolCallsAccum = result.toolCalls;
    totalTokensIn = result.tokensIn;
    totalTokensOut = result.tokensOut;

    if (result.hasToolCalls) {
      const toolCallsArray = Object.values(toolCallsAccum);

      res.write(`data: ${JSON.stringify({ type: 'tool_calls_start', tools: toolCallsArray.map(tc => tc.function.name) })}\n\n`);

      const toolResults = await iaToolsService.executeTools(toolCallsArray, userId);

      res.write(`data: ${JSON.stringify({ type: 'tool_results', results: toolResults.map(tr => ({ name: toolCallsArray.find(tc => tc.id === tr.tool_call_id)?.function.name, result: JSON.parse(tr.content) })) })}\n\n`);

      messages.push({
        role: 'assistant',
        content: fullContent || null,
        tool_calls: toolCallsArray.map(tc => ({ id: tc.id, type: 'function', function: { name: tc.function.name, arguments: tc.function.arguments } }))
      });

      for (const tr of toolResults) {
        messages.push({ role: 'tool', tool_call_id: tr.tool_call_id, content: tr.content });
      }

      const result2 = await callOpenRouter(messages, [], true, res);
      fullContent += result2.content;
      totalTokensIn += result2.tokensIn;
      totalTokensOut += result2.tokensOut;

      res.write(`data: ${JSON.stringify({ type: 'tool_calls_end' })}\n\n`);
    }

    convId = await iaConversationService.saveMensaje(convId, userId, { rol: 'user', contenido: mensaje, tokens_entrada: totalTokensIn });
    await iaConversationService.saveMensaje(convId, userId, {
      rol: 'assistant',
      contenido: fullContent,
      tool_calls: result.hasToolCalls ? Object.values(toolCallsAccum) : null,
      tokens_salida: totalTokensOut
    });

    res.write(`data: ${JSON.stringify({ type: 'done', conversacionId: convId })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (err) {
    console.error('Error en IA chat:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error procesando mensaje de IA', detalle: err.message });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }
}

async function callOpenRouter(messages, tools, stream, res) {
  const body = {
    model: MODEL,
    messages,
    stream: true,
    max_tokens: 2000,
    temperature: 0.7
  };

  if (tools && tools.length > 0) {
    body.tools = tools;
    body.tool_choice = 'auto';
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://olivas-app-web.vercel.app',
      'X-OpenRouter-Title': 'Olivas - Gestion Agricola'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter ${response.status}: ${errText.substring(0, 200)}`);
  }

  let content = '';
  let toolCallsAccum = {};
  let tokensIn = 0;
  let tokensOut = 0;
  let hasToolCalls = false;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;
      const data = trimmed.slice(6);
      if (data === '[DONE]') continue;

      try {
        const parsed = JSON.parse(data);
        const choice = parsed.choices?.[0];
        if (!choice) continue;

        const delta = choice.delta || {};

        if (delta.content) {
          content += delta.content;
          if (res && stream) {
            res.write(`data: ${JSON.stringify({ type: 'content', content: delta.content })}\n\n`);
          }
        }

        if (delta.tool_calls) {
          hasToolCalls = true;
          for (const tc of delta.tool_calls) {
            const idx = tc.index || 0;
            if (!toolCallsAccum[idx]) {
              toolCallsAccum[idx] = { id: tc.id || '', type: 'function', function: { name: '', arguments: '' } };
            }
            if (tc.id) toolCallsAccum[idx].id = tc.id;
            if (tc.function?.name) toolCallsAccum[idx].function.name += tc.function.name;
            if (tc.function?.arguments) toolCallsAccum[idx].function.arguments += tc.function.arguments;
          }
        }

        if (parsed.usage) {
          tokensIn = parsed.usage.prompt_tokens || 0;
          tokensOut = parsed.usage.completion_tokens || 0;
        }
      } catch (e) {
        // ignore parse errors on partial chunks
      }
    }
  }

  return { content, toolCalls: toolCallsAccum, hasToolCalls, tokensIn, tokensOut };
}

module.exports = { chat };
