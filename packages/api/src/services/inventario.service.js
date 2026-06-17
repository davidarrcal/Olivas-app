const prisma = require('../prisma');

class InventarioService {
  async crear(data) {
    return prisma.inventario.create({ data, include: { producto: true } });
  }
  async obtenerTodos(fincaId) {
    return prisma.inventario.findMany({ where: { finca_id: fincaId }, include: { producto: true }, orderBy: { id: 'asc' } });
  }
  async obtenerPorId(id) {
    return prisma.inventario.findUnique({ where: { id }, include: { producto: true } });
  }
  async actualizar(id, data) {
    return prisma.inventario.update({ where: { id }, data, include: { producto: true } });
  }
  async eliminar(id) {
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