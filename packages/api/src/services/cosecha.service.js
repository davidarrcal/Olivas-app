const prisma = require('../prisma');

class CosechaService {
  async crear(bancalId, data) {
    return prisma.cosecha.create({ data: { ...data, bancal_id: bancalId } });
  }
  async obtenerTodos(bancalId) {
    return prisma.cosecha.findMany({ where: { bancal_id: bancalId }, orderBy: { fecha: 'desc' } });
  }
  async obtenerPorId(id) {
    return prisma.cosecha.findUnique({ where: { id } });
  }
  async actualizar(id, data) {
    return prisma.cosecha.update({ where: { id }, data });
  }
  async eliminar(id) {
    return prisma.cosecha.delete({ where: { id } });
  }
}

module.exports = new CosechaService();