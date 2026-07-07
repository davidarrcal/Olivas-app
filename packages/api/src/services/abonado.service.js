const prisma = require('../prisma');

class AbonadoService {
  async crear(bancalId, data) {
    return prisma.abonado.create({ data: { ...data, bancal_id: bancalId }, include: { producto: true } });
  }
  async obtenerTodos(bancalId) {
    return prisma.abonado.findMany({ where: { bancal_id: bancalId }, include: { producto: true }, orderBy: { fecha: 'desc' } });
  }
  async obtenerPorId(id, userId) {
    return prisma.abonado.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } }, include: { producto: true } });
  }
  async actualizar(id, data, userId) {
    const existe = await prisma.abonado.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
    if (!existe) throw new Error('No encontrado');
    return prisma.abonado.update({ where: { id }, data, include: { producto: true } });
  }
  async eliminar(id, userId) {
    const existe = await prisma.abonado.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
    if (!existe) throw new Error('No encontrado');
    return prisma.abonado.delete({ where: { id } });
  }
}

module.exports = new AbonadoService();