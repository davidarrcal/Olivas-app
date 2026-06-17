const prisma = require('../prisma');

class MeteoDatosService {
  async crear(fincaId, data) {
    return prisma.meteoDatos.create({ data: { ...data, finca_id: fincaId } });
  }
  async obtenerTodos(fincaId, desde, hasta) {
    const where = { finca_id: fincaId };
    if (desde || hasta) {
      where.fecha = {};
      if (desde) where.fecha.gte = new Date(desde);
      if (hasta) where.fecha.lte = new Date(hasta);
    }
    return prisma.meteoDatos.findMany({ where, orderBy: { fecha: 'desc' } });
  }
  async obtenerPorId(id) {
    return prisma.meteoDatos.findUnique({ where: { id } });
  }
  async actualizar(id, data) {
    return prisma.meteoDatos.update({ where: { id }, data });
  }
  async eliminar(id) {
    return prisma.meteoDatos.delete({ where: { id } });
  }
  async resumen(fincaId) {
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
    const inicioAnio = new Date(now.getFullYear(), 0, 1);
    const [lluviaMes, lluviaAnio, tempMaxMes, tempMinMes] = await Promise.all([
      prisma.meteoDatos.aggregate({ _sum: { lluvia_mm: true }, where: { finca_id: fincaId, fecha: { gte: inicioMes } } }),
      prisma.meteoDatos.aggregate({ _sum: { lluvia_mm: true }, where: { finca_id: fincaId, fecha: { gte: inicioAnio } } }),
      prisma.meteoDatos.aggregate({ _max: { temp_max: true }, where: { finca_id: fincaId, fecha: { gte: inicioMes } } }),
      prisma.meteoDatos.aggregate({ _min: { temp_min: true }, where: { finca_id: fincaId, fecha: { gte: inicioMes } } }),
    ]);
    return {
      lluvia_mes: lluviaMes._sum.lluvia_mm || 0,
      lluvia_anio: lluviaAnio._sum.lluvia_mm || 0,
      temp_max_mes: tempMaxMes._max.temp_max || null,
      temp_min_mes: tempMinMes._min.temp_min || null
    };
  }
}

module.exports = new MeteoDatosService();