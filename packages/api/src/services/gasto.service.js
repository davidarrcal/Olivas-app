const prisma = require('../prisma');

class GastoService {
  async crear(data) { return prisma.gasto.create({ data }); }
  async obtenerTodos(fincaId, categoria) {
    const where = { finca_id: fincaId };
    if (categoria) where.categoria = categoria;
    return prisma.gasto.findMany({ where, include: { bancal: { select: { id: true, nombre: true } } }, orderBy: { fecha: 'desc' } });
  }
  async obtenerPorId(id, userId) { return prisma.gasto.findFirst({ where: { id, finca: { usuario_id: userId } } }); }
  async actualizar(id, data, userId) { const existe = await prisma.gasto.findFirst({ where: { id, finca: { usuario_id: userId } } }); if (!existe) throw new Error('No encontrado'); return prisma.gasto.update({ where: { id }, data }); }
  async eliminar(id, userId) { const existe = await prisma.gasto.findFirst({ where: { id, finca: { usuario_id: userId } } }); if (!existe) throw new Error('No encontrado'); return prisma.gasto.delete({ where: { id } }); }
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