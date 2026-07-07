const prisma = require('../prisma');

class AnalisisService {
  async crear(bancalId, data) {
    return prisma.analisis.create({ data: { ...data, bancal_id: bancalId } });
  }
  async obtenerTodos(bancalId) {
    return prisma.analisis.findMany({ where: { bancal_id: bancalId }, orderBy: { fecha: 'desc' } });
  }
  async obtenerPorId(id, userId) {
    return prisma.analisis.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
  }
  async actualizar(id, data, userId) {
    const existe = await prisma.analisis.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
    if (!existe) throw new Error('No encontrado');
    return prisma.analisis.update({ where: { id }, data });
  }
  async eliminar(id, userId) {
    const existe = await prisma.analisis.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
    if (!existe) throw new Error('No encontrado');
    return prisma.analisis.delete({ where: { id } });
  }
}

module.exports = new AnalisisService();