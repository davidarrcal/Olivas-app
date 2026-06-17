const prisma = require('../prisma');

class IngresoService {
  async crear(data) { return prisma.ingreso.create({ data }); }
  async obtenerTodos(fincaId, categoria) {
    const where = { finca_id: fincaId };
    if (categoria) where.categoria = categoria;
    return prisma.ingreso.findMany({ where, orderBy: { fecha: 'desc' } });
  }
  async obtenerPorId(id) { return prisma.ingreso.findUnique({ where: { id } }); }
  async actualizar(id, data) { return prisma.ingreso.update({ where: { id }, data }); }
  async eliminar(id) { return prisma.ingreso.delete({ where: { id } }); }
  async resumen(fincaId) {
    const ingresos = await prisma.ingreso.findMany({ where: { finca_id: fincaId } });
    let total = 0;
    const porCategoria = {};
    let totalKg = 0;
    ingresos.forEach(i => {
      porCategoria[i.categoria] = (porCategoria[i.categoria] || 0) + i.importe;
      total += i.importe;
      if (i.kg_vendidos) totalKg += i.kg_vendidos;
    });
    return { total, porCategoria, totalKg };
  }
}

module.exports = new IngresoService();