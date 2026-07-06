const prisma = require('../prisma');

async function log(userId, accion, herramienta, parametros, resultado, exito, errorMsg) {
  try {
    await prisma.auditoriaIA.create({
      data: {
        usuario_id: userId,
        accion,
        herramienta: herramienta || null,
        parametros: parametros || null,
        resultado: resultado ? JSON.stringify(resultado).substring(0, 2000) : null,
        exito,
        error: errorMsg || null
      }
    });
  } catch (e) {
    console.error('Error guardando auditoria IA:', e.message);
  }
}

module.exports = { log };
