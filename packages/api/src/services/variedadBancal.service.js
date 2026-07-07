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

  async obtenerPorId(id, userId) {
    return prisma.variedadBancal.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
  }

  async actualizar(id, data, userId) {
    const existe = await prisma.variedadBancal.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
    if (!existe) throw new Error('No encontrado');
    return prisma.variedadBancal.update({ where: { id }, data });
  }

  async eliminar(id, userId) {
    const existe = await prisma.variedadBancal.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
    if (!existe) throw new Error('No encontrado');
    return prisma.variedadBancal.delete({ where: { id } });
  }
}

module.exports = new VariedadBancalService();