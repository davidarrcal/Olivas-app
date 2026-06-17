const prisma = require('../prisma');

class MantenimientoService {
  async crear(data) { return prisma.mantenimiento.create({ data }); }
  async obtenerTodos(maquinariaId) { return prisma.mantenimiento.findMany({ where: { maquinaria_id: maquinariaId }, orderBy: { fecha: 'desc' } }); }
  async obtenerPorId(id) { return prisma.mantenimiento.findUnique({ where: { id } }); }
  async actualizar(id, data) { return prisma.mantenimiento.update({ where: { id }, data }); }
  async eliminar(id) { return prisma.mantenimiento.delete({ where: { id } }); }
}

module.exports = new MantenimientoService();