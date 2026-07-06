const prisma = require('../prisma');
const aemetService = require('./aemet.service');

async function generarAlertasProactivas(userId) {
  const fincas = await prisma.finca.findMany();
  const alertasGeneradas = [];

  for (const finca of fincas) {
    try {
      const prediccion = await aemetService.getPrediccionSemana();

      const heladas = prediccion.filter(p => p.temp_min !== null && p.temp_min < 2);
      if (heladas.length > 0) {
        const alerta = await prisma.alertaIA.create({
          data: {
            usuario_id: userId,
            finca_id: finca.id,
            tipo: 'helada',
            severidad: 'critico',
            titulo: 'Riesgo de helada',
            mensaje: `Temperaturas minimas de ${heladas[0].temp_min}C previstas para ${new Date(heladas[0].fecha).toLocaleDateString('es-ES')}. Protege los cultivos sensibles.`
          }
        });
        alertasGeneradas.push(alerta);
      }

      const calor = prediccion.filter(p => p.temp_max !== null && p.temp_max > 38);
      if (calor.length > 0) {
        const alerta = await prisma.alertaIA.create({
          data: {
            usuario_id: userId,
            finca_id: finca.id,
            tipo: 'riego',
            severidad: 'aviso',
            titulo: 'Ola de calor',
            mensaje: `Temperaturas de ${calor[0].temp_max}C previstas. Aumenta el riego y evita tratamientos en horas centrales del dia.`
          }
        });
        alertasGeneradas.push(alerta);
      }

      const lluvia = prediccion.filter(p => p.prob_precipitacion !== null && p.prob_precipitacion > 70);
      if (lluvia.length > 0) {
        const alerta = await prisma.alertaIA.create({
          data: {
            usuario_id: userId,
            finca_id: finca.id,
            tipo: 'lluvia',
            severidad: 'info',
            titulo: 'Lluvia prevista',
            mensaje: `Probabilidad de lluvia del ${lluvia[0].prob_precipitacion}% en ${new Date(lluvia[0].fecha).toLocaleDateString('es-ES')}. Considera retrasar tratamientos y riegos.`
          }
        });
        alertasGeneradas.push(alerta);
      }
    } catch (e) {
      console.error('Error generando alertas AEMET para finca', finca.id, e.message);
    }

    try {
      const stockBajo = await prisma.inventario.findMany({
        where: { finca_id: finca.id, stock_minimo: { not: null } },
        include: { producto: true }
      });
      for (const item of stockBajo) {
        if (item.stock_actual <= item.stock_minimo) {
          const existe = await prisma.alertaIA.findFirst({
            where: {
              usuario_id: userId,
              finca_id: finca.id,
              tipo: 'stock',
              leida: false,
              fecha_creacion: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            }
          });
          if (!existe) {
            const alerta = await prisma.alertaIA.create({
              data: {
                usuario_id: userId,
                finca_id: finca.id,
                tipo: 'stock',
                severidad: 'aviso',
                titulo: 'Stock bajo',
                mensaje: `${item.producto?.nombre || 'Producto'}: ${item.stock_actual} unidades (minimo: ${item.stock_minimo})`
              }
            });
            alertasGeneradas.push(alerta);
          }
        }
      }
    } catch (e) { }

    try {
      const tratamientos = await prisma.tratamiento.findMany({
        where: { bancal: { finca_id: finca.id }, periodo_seguridad_dias: { not: null } },
        include: { bancal: { select: { nombre: true } } }
      });
      for (const t of tratamientos) {
        const finSeguridad = new Date(t.fecha);
        finSeguridad.setDate(finSeguridad.getDate() + (t.periodo_seguridad_dias || 0));
        const diasRestantes = Math.ceil((finSeguridad - new Date()) / (1000 * 60 * 60 * 24));
        if (diasRestantes > 0 && diasRestantes <= 7) {
          const existe = await prisma.alertaIA.findFirst({
            where: {
              usuario_id: userId,
              finca_id: finca.id,
              tipo: 'plaga',
              titulo: { contains: t.bancal.nombre },
              leida: false,
              fecha_creacion: { gte: new Date(Date.now() - 12 * 60 * 60 * 1000) }
            }
          });
          if (!existe) {
            const alerta = await prisma.alertaIA.create({
              data: {
                usuario_id: userId,
                finca_id: finca.id,
                tipo: 'plaga',
                severidad: 'info',
                titulo: `Periodo de seguridad - ${t.bancal.nombre}`,
                mensaje: `Faltan ${diasRestantes} dias para poder recolectar (tratamiento del ${new Date(t.fecha).toLocaleDateString('es-ES')})`
              }
            });
            alertasGeneradas.push(alerta);
          }
        }
      }
    } catch (e) { }
  }

  return alertasGeneradas;
}

module.exports = { generarAlertasProactivas };
