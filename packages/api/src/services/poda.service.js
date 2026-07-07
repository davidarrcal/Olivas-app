const prisma = require('../prisma');

class PodaService {
  async crear(bancalId, data) {
    return prisma.poda.create({ data: { ...data, bancal_id: bancalId } });
  }
  async obtenerTodos(bancalId) {
    return prisma.poda.findMany({ where: { bancal_id: bancalId }, orderBy: { fecha: 'desc' } });
  }
  async obtenerPorId(id, userId) {
    return prisma.poda.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
  }
  async actualizar(id, data, userId) {
    const existe = await prisma.poda.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
    if (!existe) throw new Error('No encontrado');
    return prisma.poda.update({ where: { id }, data });
  }
  async eliminar(id, userId) {
    const existe = await prisma.poda.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
    if (!existe) throw new Error('No encontrado');
    return prisma.poda.delete({ where: { id } });
  }
}

module.exports = new PodaService();