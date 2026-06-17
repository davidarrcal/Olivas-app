const prisma = require('../prisma');

class PodaService {
  async crear(bancalId, data) {
    return prisma.poda.create({ data: { ...data, bancal_id: bancalId } });
  }
  async obtenerTodos(bancalId) {
    return prisma.poda.findMany({ where: { bancal_id: bancalId }, orderBy: { fecha: 'desc' } });
  }
  async obtenerPorId(id) {
    return prisma.poda.findUnique({ where: { id } });
  }
  async actualizar(id, data) {
    return prisma.poda.update({ where: { id }, data });
  }
  async eliminar(id) {
    return prisma.poda.delete({ where: { id } });
  }
}

module.exports = new PodaService();