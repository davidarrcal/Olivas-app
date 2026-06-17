const prisma = require('../prisma');

class MaquinariaService {
  async crear(data) { return prisma.maquinaria.create({ data }); }
  async obtenerTodos(fincaId) {
    return prisma.maquinaria.findMany({ where: { finca_id: fincaId }, include: { mantenimientos: { orderBy: { fecha: 'desc' } } }, orderBy: { nombre: 'asc' } });
  }
  async obtenerPorId(id) { return prisma.maquinaria.findUnique({ where: { id }, include: { mantenimientos: { orderBy: { fecha: 'desc' } } } }); }
  async actualizar(id, data) { return prisma.maquinaria.update({ where: { id }, data }); }
  async eliminar(id) { return prisma.maquinaria.delete({ where: { id } }); }
}

module.exports = new MaquinariaService();