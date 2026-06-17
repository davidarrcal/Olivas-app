const prisma = require('../prisma');

class VariedadBancalService {
  async crear(bancalId, data) {
    return prisma.variedadBancal.create({
      data: { ...data, bancal_id: bancalId }
    });
  }

  async obtenerTodos(bancalId) {
    return prisma.variedadBancal.findMany({
      where: { bancal_id: bancalId },
      orderBy: { variedad: 'asc' }
    });
  }

  async obtenerPorId(id) {
    return prisma.variedadBancal.findUnique({ where: { id } });
  }

  async actualizar(id, data) {
    return prisma.variedadBancal.update({ where: { id }, data });
  }

  async eliminar(id) {
    return prisma.variedadBancal.delete({ where: { id } });
  }
}

module.exports = new VariedadBancalService();