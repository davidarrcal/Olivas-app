const prisma = require('../prisma');

class FincaService {
  async crear(data, userId) {
    return prisma.finca.create({ data: { ...data, usuario_id: userId } });
  }

  async obtenerTodas(userId) {
    return prisma.finca.findMany({
      where: { usuario_id: userId },
      include: {
        _count: { select: { bancales: true } }
      },
      orderBy: { nombre: 'asc' }
    });
  }

  async obtenerPorId(id, userId) {
    return prisma.finca.findFirst({
      where: { id, usuario_id: userId },
      include: {
        bancales: { orderBy: { nombre: 'asc' } },
        _count: { select: { bancales: true, maquinarias: true } }
      }
    });
  }

  async actualizar(id, data, userId) {
    const finca = await prisma.finca.findFirst({ where: { id, usuario_id: userId }, select: { id: true } });
    if (!finca) return null;
    return prisma.finca.update({ where: { id }, data });
  }

  async eliminar(id, userId) {
    const finca = await prisma.finca.findFirst({ where: { id, usuario_id: userId }, select: { id: true } });
    if (!finca) return null;
    return prisma.finca.delete({ where: { id } });
  }

  async resumen(id, userId) {
    const finca = await prisma.finca.findFirst({
      where: { id, usuario_id: userId },
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
