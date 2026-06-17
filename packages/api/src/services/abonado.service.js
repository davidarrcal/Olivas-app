const prisma = require('../prisma');

class AbonadoService {
  async crear(bancalId, data) {
    return prisma.abonado.create({ data: { ...data, bancal_id: bancalId }, include: { producto: true } });
  }
  async obtenerTodos(bancalId) {
    return prisma.abonado.findMany({ where: { bancal_id: bancalId }, include: { producto: true }, orderBy: { fecha: 'desc' } });
  }
  async obtenerPorId(id) {
    return prisma.abonado.findUnique({ where: { id }, include: { producto: true } });
  }
  async actualizar(id, data) {
    return prisma.abonado.update({ where: { id }, data, include: { producto: true } });
  }
  async eliminar(id) {
    return prisma.abonado.delete({ where: { id } });
  }
}

module.exports = new AbonadoService();