const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Plantando datos de ejemplo...');

  const finca = await prisma.finca.create({
    data: {
      nombre: 'Cortijo Las Oliveras',
      ubicacion: 'Jaén, Andalucía',
      altitud: 620,
      latitud: 37.7796,
      longitud: -3.7849,
      superficie_total: 12.5
    }
  });
  console.log(`Finca: ${finca.nombre}`);

  const bancal1 = await prisma.bancal.create({
    data: {
      finca_id: finca.id,
      nombre: 'La Loma',
      superficie: 4.2,
      textura_suelo: 'franco',
      pendiente: 8.5,
      marco_plantacion: '7x4'
    }
  });

  const bancal2 = await prisma.bancal.create({
    data: {
      finca_id: finca.id,
      nombre: 'El Cerro',
      superficie: 5.0,
      textura_suelo: 'arcilloso',
      pendiente: 15.0,
      marco_plantacion: '6x6'
    }
  });

  const bancal3 = await prisma.bancal.create({
    data: {
      finca_id: finca.id,
      nombre: 'La Vega',
      superficie: 3.3,
      textura_suelo: 'franco_arenoso',
      pendiente: 2.0,
      marco_plantacion: '7x5'
    }
  });
  console.log(`Bancales: ${[bancal1, bancal2, bancal3].map(b => b.nombre).join(', ')}`);

  const variedades = await Promise.all([
    prisma.variedadBancal.create({ data: { bancal_id: bancal1.id, variedad: 'Picual', num_arboles: 200, ano_plantacion: 1998, produccion_estimada: 4500 } }),
    prisma.variedadBancal.create({ data: { bancal_id: bancal1.id, variedad: 'Hojiblanca', num_arboles: 50, ano_plantacion: 2005, produccion_estimada: 800 } }),
    prisma.variedadBancal.create({ data: { bancal_id: bancal2.id, variedad: 'Picual', num_arboles: 300, ano_plantacion: 1995, produccion_estimada: 7200 } }),
    prisma.variedadBancal.create({ data: { bancal_id: bancal3.id, variedad: 'Arbequina', num_arboles: 150, ano_plantacion: 2015, produccion_estimada: 2200 } }),
  ]);
  console.log(`Variedades creadas: ${variedades.length}`);

  const productos = await Promise.all([
    prisma.producto.create({ data: { nombre: 'Nitrato amónico 33.5%', tipo: 'abono', composicion: 'N 33.5%', unidad_medida: 'kg', precio_unitario: 0.85 } }),
    prisma.producto.create({ data: { nombre: 'Complejo 12-12-17', tipo: 'abono', composicion: 'NPK 12-12-17 + 2MgO', unidad_medida: 'kg', precio_unitario: 1.10 } }),
    prisma.producto.create({ data: { nombre: 'Bórax', tipo: 'abono', composicion: 'B 11%', unidad_medida: 'kg', precio_unitario: 3.50 } }),
    prisma.producto.create({ data: { nombre: 'Fosfato monopotásico', tipo: 'abono', composicion: 'P2O5 52% + K2O 34%', unidad_medida: 'kg', precio_unitario: 4.20 } }),
    prisma.producto.create({ data: { nombre: 'Deltametrina 2.5% EC', tipo: 'fitosanitario', composicion: 'Deltametrina 2.5%', unidad_medida: 'litros', precio_unitario: 18.50 } }),
    prisma.producto.create({ data: { nombre: 'Oxicloruro de cobre 50%', tipo: 'fitosanitario', composicion: 'Cu 50%', unidad_medida: 'kg', precio_unitario: 12.00 } }),
    prisma.producto.create({ data: { nombre: 'Compost olivar', tipo: 'abono', composicion: 'MO 35%, NPK 2-1-2', unidad_medida: 'kg', precio_unitario: 0.15 } }),
  ]);
  console.log(`Productos creados: ${productos.length}`);

  const riegos = await Promise.all([
    prisma.riego.create({ data: { bancal_id: bancal1.id, fecha_inicio: new Date('2026-06-10T06:00:00'), fecha_fin: new Date('2026-06-10T08:30:00'), volumen_m3: 85, precipitacion_mm: 0, etp: 5.2, humedad_suelo_pct: 35 } }),
    prisma.riego.create({ data: { bancal_id: bancal3.id, fecha_inicio: new Date('2026-06-12T06:00:00'), fecha_fin: new Date('2026-06-12T09:00:00'), volumen_m3: 120, precipitacion_mm: 0, etp: 5.8, humedad_suelo_pct: 30 } }),
    prisma.riego.create({ data: { bancal_id: bancal2.id, fecha_inicio: new Date('2026-06-14T06:00:00'), fecha_fin: new Date('2026-06-14T10:00:00'), volumen_m3: 150, precipitacion_mm: 0, etp: 6.1, humedad_suelo_pct: 28 } }),
  ]);
  console.log(`Riegos creados: ${riegos.length}`);

  const abonados = await Promise.all([
    prisma.abonado.create({ data: { bancal_id: bancal1.id, producto_id: productos[1].id, fecha: new Date('2026-03-15'), tipo: 'suelo', npk: '12-12-17', dosis: 500, dosis_unidad: 'kg/ha', estado_fenologico: 'yema_hinchada' } }),
    prisma.abonado.create({ data: { bancal_id: bancal2.id, producto_id: productos[0].id, fecha: new Date('2026-03-20'), tipo: 'suelo', npk: 'N 33.5%', dosis: 300, dosis_unidad: 'kg/ha', estado_fenologico: 'diferenciacion_floral' } }),
    prisma.abonado.create({ data: { bancal_id: bancal3.id, producto_id: productos[2].id, fecha: new Date('2026-05-01'), tipo: 'foliar', npk: 'B 11%', dosis: 2, dosis_unidad: 'kg/100L', estado_fenologico: 'cuajado' } }),
  ]);
  console.log(`Abonados creados: ${abonados.length}`);

  const tratamientos = await Promise.all([
    prisma.tratamiento.create({ data: { bancal_id: bancal1.id, producto_id: productos[4].id, fecha: new Date('2026-06-01'), dosis: '150 ml/hl', periodo_seguridad_dias: 7, plaga_enfermedad: 'Mosca del olivo (Bactrocera oleae)' } }),
    prisma.tratamiento.create({ data: { bancal_id: bancal2.id, producto_id: productos[5].id, fecha: new Date('2026-04-15'), dosis: '3 kg/hl', periodo_seguridad_dias: 21, plaga_enfermedad: 'Repilo o Antracnosis (Spilocaea oleagina)' } }),
  ]);
  console.log(`Tratamientos creados: ${tratamientos.length}`);

  const podas = await Promise.all([
    prisma.poda.create({ data: { bancal_id: bancal1.id, fecha: new Date('2026-02-10'), tipo: 'fructificacion', volumen_lena_kg: 2500 } }),
    prisma.poda.create({ data: { bancal_id: bancal2.id, fecha: new Date('2026-02-20'), tipo: 'renovacion', volumen_lena_kg: 3800 } }),
  ]);
  console.log(`Podas creadas: ${podas.length}`);

  const cosechas = await Promise.all([
    prisma.cosecha.create({ data: { bancal_id: bancal1.id, fecha: new Date('2025-11-20'), metodo_recoleccion: 'vibrador', kg_totales: 4200, rendimiento_graso_pct: 21.5, almazara: 'Cooperativa San Juan' } }),
    prisma.cosecha.create({ data: { bancal_id: bancal2.id, fecha: new Date('2025-12-01'), metodo_recoleccion: 'vibrador', kg_totales: 6800, rendimiento_graso_pct: 22.1, almazara: 'Cooperativa San Juan' } }),
    prisma.cosecha.create({ data: { bancal_id: bancal3.id, fecha: new Date('2025-11-25'), metodo_recoleccion: 'ordeno', kg_totales: 2100, rendimiento_graso_pct: 19.8, almazara: 'Almazara Los Olivos' } }),
  ]);
  console.log(`Cosechas creadas: ${cosechas.length}`);

  const meteoDatos = [
    ...Array.from({ length: 10 }, (_, i) => ({
      finca_id: finca.id,
      fecha: new Date(`2026-06-${String(i + 7).padStart(2, '0')}`),
      temp_max: 30 + Math.random() * 8,
      temp_min: 14 + Math.random() * 6,
      lluvia_mm: i === 2 ? 12.5 : (i === 7 ? 3.2 : 0),
      humedad_pct: 30 + Math.random() * 25,
      fuente: 'manual'
    }))
  ];
  await prisma.meteoDatos.createMany({ data: meteoDatos });
  console.log(`Datos meteo creados: ${meteoDatos.length}`);

  await prisma.maquinaria.createMany({
    data: [
      { finca_id: finca.id, nombre: 'Tractor John Deere 5075', tipo: 'tractor', horas_actuales: 3200 },
      { finca_id: finca.id, nombre: 'Atomizador Móvil 1000L', tipo: 'atomizador', horas_actuales: 850 },
      { finca_id: finca.id, nombre: 'Vibrador de olivos', tipo: 'vibrador', horas_actuales: 420 },
    ]
  });
  console.log('Maquinaria creada: 3');

  await prisma.gasto.createMany({
    data: [
      { finca_id: finca.id, fecha: new Date('2026-03-15'), concepto: 'Abonado fondo La Loma', categoria: 'abono', importe: 580 },
      { finca_id: finca.id, fecha: new Date('2026-06-01'), concepto: 'Tratamiento mosca', categoria: 'fitosanitario', importe: 120 },
      { finca_id: finca.id, bancal_id: bancal1.id, fecha: new Date('2026-05-20'), concepto: 'Agua riego junio', categoria: 'riego', importe: 85 },
      { finca_id: finca.id, fecha: new Date('2026-04-10'), concepto: 'Diesel tractor', categoria: 'combustible', importe: 210 },
    ]
  });
  console.log('Gastos creados: 4');

  await prisma.ingreso.createMany({
    data: [
      { finca_id: finca.id, fecha: new Date('2025-11-25'), concepto: 'Venta aceituna La Loma', categoria: 'venta_aceituna', importe: 2520, kg_vendidos: 4200, precio_kg: 0.60 },
      { finca_id: finca.id, fecha: new Date('2025-12-05'), concepto: 'Venta aceituna El Cerro', categoria: 'venta_aceituna', importe: 4420, kg_vendidos: 6800, precio_kg: 0.65 },
      { finca_id: finca.id, fecha: new Date('2025-12-10'), concepto: 'Subvención PAC 2025', categoria: 'subvencion', importe: 1800 },
    ]
  });
  console.log('Ingresos creados: 3');

  await prisma.config.createMany({
    data: [
      { clave: 'moneda', valor: 'EUR' },
      { clave: 'unidad_superficie', valor: 'ha' },
      { clave: 'unidad_riego', valor: 'm3' },
      { clave: 'unidad_produccion', valor: 'kg' },
    ]
  });
  console.log('Configuración creada: 4');

  console.log('\n*** Base de datos plantada con éxito ***');
}

main()
  .catch((e) => {
    console.error('Error plantando datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });