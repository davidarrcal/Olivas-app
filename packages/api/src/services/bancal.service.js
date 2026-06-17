const prisma = require('../prisma');

class BancalService {
  async crear(data) {
    return prisma.bancal.create({
      data,
      include: { finca: true }
    });
  }

  async obtenerTodos(fincaId) {
    return prisma.bancal.findMany({
      where: { finca_id: fincaId },
      include: {
        variedades: true,
        _count: { select: { riegos: true, abonados: true, tratamientos: true, podas: true, cosechas: true } }
      },
      orderBy: { nombre: 'asc' }
    });
  }

  async obtenerPorId(id) {
    return prisma.bancal.findUnique({
      where: { id },
      include: {
        finca: true,
        variedades: true,
        riegos: { orderBy: { fecha_inicio: 'desc' }, take: 5 },
        abonados: { orderBy: { fecha: 'desc' }, take: 5, include: { producto: true } },
        tratamientos: { orderBy: { fecha: 'desc' }, take: 5, include: { producto: true } },
        podas: { orderBy: { fecha: 'desc' }, take: 5 },
        cosechas: { orderBy: { fecha: 'desc' }, take: 5 },
        analisis: { orderBy: { fecha: 'desc' }, take: 5 }
      }
    });
  }

  async actualizar(id, data) {
    return prisma.bancal.update({
      where: { id },
      data,
      include: { finca: true }
    });
  }

  async eliminar(id) {
    return prisma.bancal.delete({ where: { id } });
  }
}

module.exports = new BancalService();