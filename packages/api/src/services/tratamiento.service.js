const prisma = require('../prisma');

class TratamientoService {
  async crear(bancalId, data) {
    return prisma.tratamiento.create({ data: { ...data, bancal_id: bancalId }, include: { producto: true } });
  }
  async obtenerTodos(bancalId) {
    return prisma.tratamiento.findMany({ where: { bancal_id: bancalId }, include: { producto: true }, orderBy: { fecha: 'desc' } });
  }
  async obtenerPorId(id, userId) {
    return prisma.tratamiento.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } }, include: { producto: true } });
  }
  async actualizar(id, data, userId) {
    const existe = await prisma.tratamiento.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
    if (!existe) throw new Error('No encontrado');
    return prisma.tratamiento.update({ where: { id }, data, include: { producto: true } });
  }
  async eliminar(id, userId) {
    const existe = await prisma.tratamiento.findFirst({ where: { id, bancal: { finca: { usuario_id: userId } } } });
    if (!existe) throw new Error('No encontrado');
    return prisma.tratamiento.delete({ where: { id } });
  }
}

module.exports = new TratamientoService();