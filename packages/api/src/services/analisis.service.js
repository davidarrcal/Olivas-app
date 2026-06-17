const prisma = require('../prisma');

class AnalisisService {
  async crear(bancalId, data) {
    return prisma.analisis.create({ data: { ...data, bancal_id: bancalId } });
  }
  async obtenerTodos(bancalId) {
    return prisma.analisis.findMany({ where: { bancal_id: bancalId }, orderBy: { fecha: 'desc' } });
  }
  async obtenerPorId(id) {
    return prisma.analisis.findUnique({ where: { id } });
  }
  async actualizar(id, data) {
    return prisma.analisis.update({ where: { id }, data });
  }
  async eliminar(id) {
    return prisma.analisis.delete({ where: { id } });
  }
}

module.exports = new AnalisisService();