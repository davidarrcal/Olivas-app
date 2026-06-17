const prisma = require('../prisma');

class GastoService {
  async crear(data) { return prisma.gasto.create({ data }); }
  async obtenerTodos(fincaId, categoria) {
    const where = { finca_id: fincaId };
    if (categoria) where.categoria = categoria;
    return prisma.gasto.findMany({ where, include: { bancal: { select: { id: true, nombre: true } } }, orderBy: { fecha: 'desc' } });
  }
  async obtenerPorId(id) { return prisma.gasto.findUnique({ where: { id } }); }
  async actualizar(id, data) { return prisma.gasto.update({ where: { id }, data }); }
  async eliminar(id) { return prisma.gasto.delete({ where: { id } }); }
  async resumen(fincaId) {
    const gastos = await prisma.gasto.findMany({ where: { finca_id: fincaId } });
    const porCategoria = {};
    let total = 0;
    gastos.forEach(g => {
      porCategoria[g.categoria] = (porCategoria[g.categoria] || 0) + g.importe;
      total += g.importe;
    });
    return { total, porCategoria };
  }
}

module.exports = new GastoService();