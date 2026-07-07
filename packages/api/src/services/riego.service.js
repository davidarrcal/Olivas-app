const prisma = require('../prisma');

class RiegoService {
  async crear(bancalId, data) {
    return prisma.riego.create({ data: { ...data, bancal_id: bancalId } });
  }
  async obtenerTodos(bancalId) {
    return prisma.riego.findMany({ where: { bancal_id: bancalId }, orderBy: { fecha_inicio: 'desc' } });
  }
  async obtenerPorId(id, userId) {
    return prisma.riego.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
  }
  async actualizar(id, data, userId) {
    const existe = await prisma.riego.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
    if (!existe) throw new Error('No encontrado');
    return prisma.riego.update({ where: { id }, data });
  }
  async eliminar(id, userId) {
    const existe = await prisma.riego.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
    if (!existe) throw new Error('No encontrado');
    return prisma.riego.delete({ where: { id } });
  }
}

module.exports = new RiegoService();