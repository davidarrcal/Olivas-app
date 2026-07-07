const prisma = require('../prisma');

class InventarioService {
  async crear(data) {
    return prisma.inventario.create({ data, include: { producto: true } });
  }
  async obtenerTodos(fincaId) {
    return prisma.inventario.findMany({ where: { finca_id: fincaId }, include: { producto: true }, orderBy: { id: 'asc' } });
  }
  async obtenerPorId(id, userId) {
    return prisma.inventario.findFirst({ where: { id, finca: { usuario_id: userId } }, include: { producto: true } });
  }
  async actualizar(id, data, userId) {
    const existe = await prisma.inventario.findFirst({ where: { id, finca: { usuario_id: userId } } });
    if (!existe) throw new Error('No encontrado');
    return prisma.inventario.update({ where: { id }, data, include: { producto: true } });
  }
  async eliminar(id, userId) {
    const existe = await prisma.inventario.findFirst({ where: { id, finca: { usuario_id: userId } } });
    if (!existe) throw new Error('No encontrado');
    return prisma.inventario.delete({ where: { id } });
  }
  async alertas(fincaId) {
    return prisma.inventario.findMany({
      where: { finca_id: fincaId, stock_minimo: { not: null } },
      include: { producto: true }
    }).then(items => items.filter(i => i.stock_actual <= (i.stock_minimo || 0)));
  }
}

module.exports = new InventarioService();