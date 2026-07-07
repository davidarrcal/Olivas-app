const prisma = require('../prisma');

class DashboardService {
  async resumenGlobal(fincaId, userId) {
    const finca = await prisma.finca.findFirst({ where: { id: fincaId, usuario_id: userId } });
    if (!finca) return null;

    const [bancales, cosechas, gastos, ingresos, riegosRecientes, tratamientosRecientes, abonadosRecientes, alertasStock] = await Promise.all([
      prisma.bancal.findMany({ where: { finca_id: fincaId }, include: { variedades: true, _count: { select: { riegos: true, abonados: true, tratamientos: true, podas: true, cosechas: true } } } }),
      prisma.cosecha.aggregate({ _sum: { kg_totales: true }, where: { bancal: { finca_id: fincaId } } }),
      prisma.gasto.aggregate({ _sum: { importe: true }, where: { finca_id: fincaId } }),
      prisma.ingreso.aggregate({ _sum: { importe: true, kg_vendidos: true }, where: { finca_id: fincaId } }),
      prisma.riego.findMany({ where: { bancal: { finca_id: fincaId } }, orderBy: { fecha_inicio: 'desc' }, take: 5 }),
      prisma.tratamiento.findMany({ where: { bancal: { finca_id: fincaId } }, orderBy: { fecha: 'desc' }, take: 5, include: { bancal: { select: { nombre: true } } } }),
      prisma.abonado.findMany({ where: { bancal: { finca_id: fincaId } }, orderBy: { fecha: 'desc' }, take: 5, include: { bancal: { select: { nombre: true } }, producto: true } }),
      prisma.inventario.findMany({ where: { finca_id: fincaId, stock_minimo: { not: null } }, include: { producto: true } }).then(items => items.filter(i => i.stock_actual <= (i.stock_minimo || 0)))
    ]);

    const totalArboles = bancales.reduce((s, b) => s + b.variedades.reduce((s2, v) => s2 + v.num_arboles, 0), 0);
    const superficieTotal = bancales.reduce((s, b) => s + (b.superficie || 0), 0);

    const ahora = new Date();
    const mesActual = ahora.getMonth();

    const gastosMes = await prisma.gasto.aggregate({ _sum: { importe: true }, where: { finca_id: fincaId, fecha: { gte: new Date(ahora.getFullYear(), mesActual, 1) } } });
    const ingresosMes = await prisma.ingreso.aggregate({ _sum: { importe: true }, where: { finca_id: fincaId, fecha: { gte: new Date(ahora.getFullYear(), mesActual, 1) } } });

    const hoy = new Date();
    const tratamientosEnPeriodo = await prisma.tratamiento.findMany({
      where: { bancal: { finca_id: fincaId }, periodo_seguridad_dias: { not: null } },
      include: { bancal: { select: { nombre: true } } }
    }).then(trats => trats.map(t => {
      const fin = new Date(t.fecha);
      fin.setDate(fin.getDate() + (t.periodo_seguridad_dias || 0));
      const diasRest = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
      return { ...t, dias_restantes: diasRest, fecha_fin: fin.toISOString().split('T')[0] };
    }).filter(t => t.dias_restantes > 0));

    return {
      finca: { id: finca.id, nombre: finca.nombre, ubicacion: finca.ubicacion },
      bancales: bancales.map(b => ({ id: b.id, nombre: b.nombre, superficie: b.superficie, variedades: b.variedades, _count: b._count })),
      stats: {
        num_bancales: bancales.length,
        total_arboles: totalArboles,
        superficie_total: superficieTotal,
        kg_cosechados: cosechas._sum.kg_totales || 0,
        total_gastos: gastos._sum.importe || 0,
        total_ingresos: ingresos._sum.importe || 0,
        kg_vendidos: ingresos._sum.kg_vendidos || 0,
        gastos_mes: gastosMes._sum.importe || 0,
        ingresos_mes: ingresosMes._sum.importe || 0,
        beneficio: (ingresos._sum.importe || 0) - (gastos._sum.importe || 0)
      },
      actividad_reciente: { riegos: riegosRecientes, tratamientos: tratamientosRecientes, abonados: abonadosRecientes },
      alertas: {
        stock_bajo: alertasStock.map(a => ({ producto: a.producto?.nombre, stock: a.stock_actual, minimo: a.stock_minimo })),
        periodos_seguridad: tratamientosEnPeriodo
      }
    };
  }

  async calendario(fincaId, userId) {
    const finca = await prisma.finca.findFirst({ where: { id: fincaId, usuario_id: userId } });
    if (!finca) return null;
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const inicioAnio = new Date(anio, 0, 1);
    const finAnio = new Date(anio, 11, 31);

    const [riegos, abonados, tratamientos, podas, cosechas] = await Promise.all([
      prisma.riego.findMany({ where: { bancal: { finca_id: fincaId }, fecha_inicio: { gte: inicioAnio, lte: finAnio } }, include: { bancal: { select: { nombre: true } } }, orderBy: { fecha_inicio: 'asc' } }),
      prisma.abonado.findMany({ where: { bancal: { finca_id: fincaId }, fecha: { gte: inicioAnio, lte: finAnio } }, include: { bancal: { select: { nombre: true } }, producto: true }, orderBy: { fecha: 'asc' } }),
      prisma.tratamiento.findMany({ where: { bancal: { finca_id: fincaId }, fecha: { gte: inicioAnio, lte: finAnio } }, include: { bancal: { select: { nombre: true } }, producto: true }, orderBy: { fecha: 'asc' } }),
      prisma.poda.findMany({ where: { bancal: { finca_id: fincaId }, fecha: { gte: inicioAnio, lte: finAnio } }, include: { bancal: { select: { nombre: true } } }, orderBy: { fecha: 'asc' } }),
      prisma.cosecha.findMany({ where: { bancal: { finca_id: fincaId }, fecha: { gte: inicioAnio, lte: finAnio } }, include: { bancal: { select: { nombre: true } } }, orderBy: { fecha: 'asc' } })
    ]);

    const eventos = [
      ...riegos.map(r => ({ fecha: r.fecha_inicio, tipo: 'riego', bancal: r.bancal?.nombre, detalle: (r.volumen_m3 ? r.volumen_m3 + ' m3' : '') })),
      ...abonados.map(a => ({ fecha: a.fecha, tipo: 'abonado', bancal: a.bancal?.nombre, detalle: (a.producto?.nombre || a.tipo) + ' ' + (a.npk || '') })),
      ...tratamientos.map(t => ({ fecha: t.fecha, tipo: 'tratamiento', bancal: t.bancal?.nombre, detalle: (t.plaga_enfermedad || '') + ' - ' + (t.producto?.nombre || '') })),
      ...podas.map(p => ({ fecha: p.fecha, tipo: 'poda', bancal: p.bancal?.nombre, detalle: p.tipo })),
      ...cosechas.map(c => ({ fecha: c.fecha, tipo: 'cosecha', bancal: c.bancal?.nombre, detalle: c.kg_totales + ' kg (' + c.metodo_recoleccion + ')' }))
    ];

    eventos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    return { anio, eventos };
  }
}

module.exports = new DashboardService();