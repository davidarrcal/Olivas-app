const prisma = require('../prisma');

class FincaService {
  async crear(data) {
    return prisma.finca.create({ data });
  }

  async obtenerTodas() {
    return prisma.finca.findMany({
      include: {
        _count: { select: { bancales: true } }
      },
      orderBy: { nombre: 'asc' }
    });
  }

  async obtenerPorId(id) {
    return prisma.finca.findUnique({
      where: { id },
      include: {
        bancales: { orderBy: { nombre: 'asc' } },
        _count: { select: { bancales: true, maquinarias: true } }
      }
    });
  }

  async actualizar(id, data) {
    return prisma.finca.update({ where: { id }, data });
  }

  async eliminar(id) {
    return prisma.finca.delete({ where: { id } });
  }

  async resumen(id) {
    const finca = await prisma.finca.findUnique({
      where: { id },
      include: { bancales: { select: { id: true, superficie: true } } }
    });

    if (!finca) return null;

    const superficieTotal = finca.bancales.reduce((acc, b) => acc + (b.superficie || 0), 0);

    const [totalCosechas, totalGastos, totalIngresos] = await Promise.all([
      prisma.cosecha.aggregate({
        _sum: { kg_totales: true },
        where: { bancal: { finca_id: id } }
      }),
      prisma.gasto.aggregate({
        _sum: { importe: true },
        where: { finca_id: id }
      }),
      prisma.ingreso.aggregate({
        _sum: { importe: true },
        where: { finca_id: id }
      })
    ]);

    return {
      finca: finca.nombre,
      num_bancales: finca.bancales.length,
      superficie_cultivada: superficieTotal,
      kg_cosechados: totalCosechas._sum.kg_totales || 0,
      total_gastos: totalGastos._sum.importe || 0,
      total_ingresos: totalIngresos._sum.importe || 0
    };
  }
}

module.exports = new FincaService();