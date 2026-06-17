const prisma = require('../prisma');

class DiarioCampoService {
  async crear(bancalId, data) { return prisma.diarioCampo.create({ data: { ...data, bancal_id: bancalId } }); }
  async obtenerTodos(bancalId) { return prisma.diarioCampo.findMany({ where: { bancal_id: bancalId }, orderBy: { fecha: 'desc' } }); }
  async obtenerPorId(id) { return prisma.diarioCampo.findUnique({ where: { id } }); }
  async actualizar(id, data) { return prisma.diarioCampo.update({ where: { id }, data }); }
  async eliminar(id) { return prisma.diarioCampo.delete({ where: { id } }); }
}

module.exports = new DiarioCampoService();