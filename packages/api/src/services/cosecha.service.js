const prisma = require('../prisma');

class CosechaService {
  async crear(bancalId, data) {
    return prisma.cosecha.create({ data: { ...data, bancal_id: bancalId } });
  }
  async obtenerTodos(bancalId) {
    return prisma.cosecha.findMany({ where: { bancal_id: bancalId }, orderBy: { fecha: 'desc' } });
  }
  async obtenerPorId(id, userId) {
    return prisma.cosecha.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
  }
  async actualizar(id, data, userId) {
    const existe = await prisma.cosecha.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
    if (!existe) throw new Error('No encontrado');
    return prisma.cosecha.update({ where: { id }, data });
  }
  async eliminar(id, userId) {
    const existe = await prisma.cosecha.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
    if (!existe) throw new Error('No encontrado');
    return prisma.cosecha.delete({ where: { id } });
  }
}

module.exports = new CosechaService();