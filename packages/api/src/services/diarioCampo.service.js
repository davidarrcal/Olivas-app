const prisma = require('../prisma');

class DiarioCampoService {
  async crear(bancalId, data) { return prisma.diarioCampo.create({ data: { ...data, bancal_id: bancalId } }); }
  async obtenerTodos(bancalId) { return prisma.diarioCampo.findMany({ where: { bancal_id: bancalId }, orderBy: { fecha: 'desc' } }); }
  async obtenerPorId(id, userId) { return prisma.diarioCampo.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } }); }
  async actualizar(id, data, userId) { const existe = await prisma.diarioCampo.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } }); if (!existe) throw new Error('No encontrado'); return prisma.diarioCampo.update({ where: { id }, data }); }
  async eliminar(id, userId) { const existe = await prisma.diarioCampo.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } }); if (!existe) throw new Error('No encontrado'); return prisma.diarioCampo.delete({ where: { id } }); }
}

module.exports = new DiarioCampoService();