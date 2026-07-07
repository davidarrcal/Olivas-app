const prisma = require('../prisma');

class MaquinariaService {
  async crear(data) { return prisma.maquinaria.create({ data }); }
  async obtenerTodos(fincaId) {
    return prisma.maquinaria.findMany({ where: { finca_id: fincaId }, include: { mantenimientos: { orderBy: { fecha: 'desc' } } }, orderBy: { nombre: 'asc' } });
  }
  async obtenerPorId(id, userId) { return prisma.maquinaria.findFirst({ where: { id, finca: { usuario_id: userId } }, include: { mantenimientos: { orderBy: { fecha: 'desc' } } } }); }
  async actualizar(id, data, userId) { const existe = await prisma.maquinaria.findFirst({ where: { id, finca: { usuario_id: userId } } }); if (!existe) throw new Error('No encontrada'); return prisma.maquinaria.update({ where: { id }, data }); }
  async eliminar(id, userId) { const existe = await prisma.maquinaria.findFirst({ where: { id, finca: { usuario_id: userId } } }); if (!existe) throw new Error('No encontrada'); return prisma.maquinaria.delete({ where: { id } }); }
}

module.exports = new MaquinariaService();