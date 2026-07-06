const prisma = require('../prisma');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'nvidia/nemotron-3-super-120b-a12b:free';

async function getHistorial(conversacionId, userId) {
  if (!conversacionId) return [];

  const mensajes = await prisma.mensajeIA.findMany({
    where: { conversacion_id: conversacionId },
    orderBy: { fecha_creacion: 'asc' },
    take: 20
  });

  if (mensajes.length <= 6) {
    return mensajes.map(m => ({ role: m.rol, content: m.contenido }));
  }

  const antiguos = mensajes.slice(0, -6);
  const recientes = mensajes.slice(-6);

  const conversacion = await prisma.conversacionIA.findUnique({ where: { id: conversacionId } });

  let resumen = conversacion.resumen;
  const necesitaResumen = !resumen || (conversacion.fecha_actualizacion && antiguos.length > 0 && conversacion.fecha_actualizacion < antiguos[antiguos.length - 1].fecha_creacion);

  if (necesitaResumen) {
    resumen = await generarResumen(antiguos);
    await prisma.conversacionIA.update({ where: { id: conversacionId }, data: { resumen } });
  }

  return [
    { role: 'system', content: 'Resumen de la conversacion anterior: ' + resumen },
    ...recientes.map(m => ({ role: m.rol, content: m.contenido }))
  ];
}

async function generarResumen(mensajes) {
  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://olivas-app-web.vercel.app',
        'X-OpenRouter-Title': 'Olivas - Gestion Agricola'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'Resume esta conversacion en maximo 100 palabras. Incluye decisiones tomadas y datos relevantes. Responde en espanol.' },
          { role: 'user', content: mensajes.map(m => `${m.rol}: ${m.contenido.substring(0, 200)}`).join('\n') }
        ],
        max_tokens: 200,
        temperature: 0.3
      })
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Conversacion previa sobre gestion agricola.';
  } catch (e) {
    return 'Conversacion previa sobre gestion agricola.';
  }
}

async function saveMensaje(conversacionId, userId, mensaje) {
  let convId = conversacionId;
  if (!convId) {
    const conv = await prisma.conversacionIA.create({ data: { usuario_id: userId } });
    convId = conv.id;
  }
  await prisma.mensajeIA.create({
    data: {
      conversacion_id: convId,
      rol: mensaje.rol,
      contenido: mensaje.contenido,
      tool_calls: mensaje.tool_calls || null,
      tokens_entrada: mensaje.tokens_entrada || null,
      tokens_salida: mensaje.tokens_salida || null
    }
  });
  return convId;
}

module.exports = { getHistorial, saveMensaje, generarResumen };
