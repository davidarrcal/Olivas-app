import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const API_BASE = 'https://olivas-api.onrender.com/api';

function detectarContexto(path) {
  if (path === '/') return { pantalla: 'dashboard', entidadId: null };
  if (path === '/fincas') return { pantalla: 'fincas', entidadId: null };
  if (path.startsWith('/fincas/')) {
    const id = path.split('/')[2];
    return { pantalla: 'finca_detalle', entidadId: Number(id) };
  }
  if (path.startsWith('/bancales/')) {
    const id = path.split('/')[2];
    return { pantalla: 'bancal_detalle', entidadId: Number(id) };
  }
  if (path === '/meteo') return { pantalla: 'meteo', entidadId: null };
  if (path === '/economia') return { pantalla: 'economia', entidadId: null };
  if (path === '/calendario') return { pantalla: 'calendario', entidadId: null };
  if (path === '/informes') return { pantalla: 'informes', entidadId: null };
  return { pantalla: 'global', entidadId: null };
}

const SUGERENCIAS = [
  '¿Cuanto debo regar hoy?',
  '¿Que tareas tocan este mes?',
  '¿Como va mi economia?',
  'Analiza mi produccion',
];

export default function AsistenteIA() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [conversacionId, setConversacionId] = useState(null);
  const [toolStatus, setToolStatus] = useState(null);
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const contexto = detectarContexto(location.pathname);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function enviar(texto) {
    const mensaje = (texto || input).trim();
    if (!mensaje || streaming) return;

    setMessages(prev => [...prev, { role: 'user', content: mensaje }]);
    setInput('');
    setStreaming(true);
    setToolStatus(null);

    setMessages(prev => [...prev, { role: 'assistant', content: '', tools: [] }]);
    let assistantContent = '';
    let assistantTools = [];

    try {
      const token = localStorage.getItem('olivas_token');
      const response = await fetch(`${API_BASE}/ia/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mensaje,
          contextoPantalla: contexto.pantalla,
          entidadId: contexto.entidadId,
          conversacionId
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Error ${response.status}`);
      }

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
          if (!trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);

            if (parsed.type === 'content') {
              assistantContent += parsed.content;
              setMessages(prev => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: 'assistant', content: assistantContent, tools: assistantTools };
                return copy;
              });
            }

            if (parsed.type === 'tool_calls_start') {
              setToolStatus('Ejecutando: ' + parsed.tools.join(', '));
              assistantTools = parsed.tools;
              setMessages(prev => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: 'assistant', content: assistantContent, tools: assistantTools };
                return copy;
              });
            }

            if (parsed.type === 'tool_results') {
              setToolStatus(null);
              setMessages(prev => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: 'assistant', content: assistantContent, tools: assistantTools, toolResults: parsed.results };
                return copy;
              });
              window.dispatchEvent(new Event('ia-data-updated'));
            }

            if (parsed.type === 'tool_calls_end') {
              setToolStatus(null);
            }

            if (parsed.type === 'done') {
              if (parsed.conversacionId) setConversacionId(parsed.conversacionId);
            }

            if (parsed.type === 'error') {
              assistantContent += '\n\n*Error: ' + parsed.message + '*';
              setMessages(prev => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: 'assistant', content: assistantContent };
                return copy;
              });
            }
          } catch (e) { }
        }
      }
    } catch (err) {
      assistantContent = 'Error: ' + err.message;
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: 'assistant', content: assistantContent };
        return copy;
      });
    }
    setStreaming(false);
    setToolStatus(null);
  }

  function limpiar() {
    setMessages([]);
    setConversacionId(null);
  }

  return (
    <>
      <button
        className="ia-fab"
        onClick={() => setOpen(!open)}
        aria-label="Asistente IA"
        title="Asesor agricola IA"
      >
        {open ? '\u2715' : '\uD83E\uDD16'}
      </button>

      {open && (
        <div className="ia-panel">
          <div className="ia-header">
            <h3>{'\uD83E\uDD16'} Asesor Agricola</h3>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="ia-context-badge">{contexto.pantalla.replace(/_/g, ' ')}</span>
              {messages.length > 0 && (
                <button className="ia-clear-btn" onClick={limpiar} title="Nueva conversacion">{'\u27F3'}</button>
              )}
            </div>
          </div>

          <div className="ia-messages">
            {messages.length === 0 && (
              <div className="ia-welcome">
                <p style={{ fontWeight: '600', color: '#2d5a27' }}>{'\uD83C\uDF31'} Hola, soy tu asesor agricola.</p>
                <p style={{ color: '#6b7c6b', fontSize: '0.85rem', marginTop: '0.3rem' }}>Puedo analizar tu explotacion, recomendar riego, detectar plagas, registrar datos y mas.</p>
                <div className="ia-suggestions">
                  {SUGERENCIAS.map((s, i) => (
                    <button key={i} className="ia-suggestion-btn" onClick={() => enviar(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'ia-msg-user' : 'ia-msg-assistant'}>
                {m.tools && m.tools.length > 0 && (
                  <div className="ia-tool-indicator">
                    {'\u2699\uFE0F'} {m.tools.join(', ')}
                  </div>
                )}
                <div className="ia-msg-content">
                  {m.content || (streaming && i === messages.length - 1 ? '...' : '')}
                </div>
              </div>
            ))}
            {toolStatus && (
              <div className="ia-tool-status">{'\u2699\uFE0F'} {toolStatus}...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ia-input-area">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); } }}
              placeholder="Preguntame sobre tu explotacion..."
              disabled={streaming}
            />
            <button onClick={() => enviar()} disabled={streaming || !input.trim()} className="ia-send-btn">
              {streaming ? '...' : '\u2192'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
