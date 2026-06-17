const prisma = require('../prisma');

class RiegoService {
  async crear(bancalId, data) {
    return prisma.riego.create({ data: { ...data, bancal_id: bancalId } });
  }
  async obtenerTodos(bancalId) {
    return prisma.riego.findMany({ where: { bancal_id: bancalId }, orderBy: { fecha_inicio: 'desc' } });
  }
  async obtenerPorId(id) {
    return prisma.riego.findUnique({ where: { id } });
  }
  async actualizar(id, data) {
    return prisma.riego.update({ where: { id }, data });
  }
  async eliminar(id) {
    return prisma.riego.delete({ where: { id } });
  }
}

module.exports = new RiegoService();