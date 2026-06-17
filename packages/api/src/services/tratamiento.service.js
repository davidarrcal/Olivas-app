const prisma = require('../prisma');

class TratamientoService {
  async crear(bancalId, data) {
    return prisma.tratamiento.create({ data: { ...data, bancal_id: bancalId }, include: { producto: true } });
  }
  async obtenerTodos(bancalId) {
    return prisma.tratamiento.findMany({ where: { bancal_id: bancalId }, include: { producto: true }, orderBy: { fecha: 'desc' } });
  }
  async obtenerPorId(id) {
    return prisma.tratamiento.findUnique({ where: { id }, include: { producto: true } });
  }
  async actualizar(id, data) {
    return prisma.tratamiento.update({ where: { id }, data, include: { producto: true } });
  }
  async eliminar(id) {
    return prisma.tratamiento.delete({ where: { id } });
  }
}

module.exports = new TratamientoService();