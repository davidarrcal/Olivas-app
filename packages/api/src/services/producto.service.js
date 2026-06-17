const prisma = require('../prisma');

class ProductoService {
  async crear(data) {
    return prisma.producto.create({ data });
  }
  async obtenerTodos(filtro) {
    const where = filtro ? { tipo: filtro } : {};
    return prisma.producto.findMany({ where, orderBy: { nombre: 'asc' } });
  }
  async obtenerPorId(id) {
    return prisma.producto.findUnique({ where: { id } });
  }
  async actualizar(id, data) {
    return prisma.producto.update({ where: { id }, data });
  }
  async eliminar(id) {
    return prisma.producto.delete({ where: { id } });
  }
}

module.exports = new ProductoService();