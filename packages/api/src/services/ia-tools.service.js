const prisma = require('../prisma');
const auditoriaService = require('./ia-auditoria.service');

const ALL_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'consultar_fincas',
      description: 'Obtener lista de todas las fincas del usuario con sus bancales',
      parameters: { type: 'object', properties: {} }
    }
  },
  {
    type: 'function',
    function: {
      name: 'crear_finca',
      description: 'Crear una nueva finca o parcela',
      parameters: {
        type: 'object',
        properties: {
          nombre: { type: 'string', description: 'Nombre de la finca' },
          tipo_cultivo: { type: 'string', description: 'olivo, almendro, citricos, vid, pistacho, frutales, u otro' },
          ubicacion: { type: 'string', description: 'Ubicacion geografica' },
          altitud: { type: 'number', description: 'Altitud en metros' },
          superficie_total: { type: 'number', description: 'Superficie en hectareas' }
        },
        required: ['nombre', 'tipo_cultivo']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'consultar_bancales',
      description: 'Obtener bancales de una finca con sus variedades',
      parameters: {
        type: 'object',
        properties: { finca_id: { type: 'number' } },
        required: ['finca_id']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'crear_bancal',
      description: 'Crear un nuevo bancal dentro de una finca',
      parameters: {
        type: 'object',
        properties: {
          finca_id: { type: 'number' },
          nombre: { type: 'string' },
          superficie: { type: 'number', description: 'Hectareas' },
          textura_suelo: { type: 'string', description: 'arcilloso, franco, arenoso, etc' },
          pendiente: { type: 'number', description: 'Porcentaje 0-100' },
          marco_plantacion: { type: 'string', description: 'Ej: 7x4' }
        },
        required: ['finca_id', 'nombre']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'registrar_riego',
      description: 'Registrar un riego en un bancal',
      parameters: {
        type: 'object',
        properties: {
          bancal_id: { type: 'number' },
          fecha_inicio: { type: 'string', description: 'Fecha ISO ej: 2026-07-06T18:00' },
          volumen_m3: { type: 'number', description: 'Metros cubicos de agua' },
          observaciones: { type: 'string' }
        },
        required: ['bancal_id', 'fecha_inicio']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'consultar_riegos',
      description: 'Consultar historial de riegos de un bancal',
      parameters: {
        type: 'object',
        properties: {
          bancal_id: { type: 'number' },
          limite: { type: 'number', description: 'Numero de registros, default 10' }
        },
        required: ['bancal_id']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'registrar_abonado',
      description: 'Registrar una aplicacion de abono o fertilizante',
      parameters: {
        type: 'object',
        properties: {
          bancal_id: { type: 'number' },
          fecha: { type: 'string', description: 'Fecha ISO' },
          tipo: { type: 'string', description: 'suelo, foliar, fertirriego, organico' },
          npk: { type: 'string', description: 'Ej: 12-12-17' },
          dosis: { type: 'number' },
          dosis_unidad: { type: 'string', description: 'kg/ha, L/ha, etc' },
          estado_fenologico: { type: 'string' },
          observaciones: { type: 'string' }
        },
        required: ['bancal_id', 'fecha', 'tipo']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'registrar_tratamiento',
      description: 'Registrar un tratamiento fitosanitario contra plaga o enfermedad',
      parameters: {
        type: 'object',
        properties: {
          bancal_id: { type: 'number' },
          fecha: { type: 'string', description: 'Fecha ISO' },
          plaga_enfermedad: { type: 'string', description: 'Nombre de la plaga o enfermedad' },
          dosis: { type: 'string' },
          periodo_seguridad_dias: { type: 'number', description: 'Dias de periodo de seguridad' },
          observaciones: { type: 'string' }
        },
        required: ['bancal_id', 'fecha']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'registrar_poda',
      description: 'Registrar una poda',
      parameters: {
        type: 'object',
        properties: {
          bancal_id: { type: 'number' },
          fecha: { type: 'string', description: 'Fecha ISO' },
          tipo: { type: 'string', description: 'formacion, fructificacion, renovacion, sanitaria' },
          volumen_lena_kg: { type: 'number', description: 'Kg de lena retirada' },
          observaciones: { type: 'string' }
        },
        required: ['bancal_id', 'fecha', 'tipo']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'registrar_cosecha',
      description: 'Registrar una cosecha o recoleccion',
      parameters: {
        type: 'object',
        properties: {
          bancal_id: { type: 'number' },
          fecha: { type: 'string', description: 'Fecha ISO' },
          metodo_recoleccion: { type: 'string', description: 'vareo, vibrador, manual, etc' },
          kg_totales: { type: 'number', description: 'Kilos totales recolectados' },
          rendimiento_graso_pct: { type: 'number', description: 'Porcentaje de rendimiento graso' },
          almazara: { type: 'string', description: 'Nombre de la almazara o industria' }
        },
        required: ['bancal_id', 'fecha', 'kg_totales']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'registrar_gasto',
      description: 'Registrar un gasto economico',
      parameters: {
        type: 'object',
        properties: {
          finca_id: { type: 'number' },
          fecha: { type: 'string', description: 'Fecha ISO' },
          concepto: { type: 'string' },
          categoria: { type: 'string', description: 'abono, fitosanitario, riego, combustible, etc' },
          importe: { type: 'number', description: 'Importe en EUR' },
          observaciones: { type: 'string' }
        },
        required: ['finca_id', 'fecha', 'concepto', 'categoria', 'importe']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'registrar_ingreso',
      description: 'Registrar un ingreso economico',
      parameters: {
        type: 'object',
        properties: {
          finca_id: { type: 'number' },
          fecha: { type: 'string', description: 'Fecha ISO' },
          concepto: { type: 'string' },
          categoria: { type: 'string', description: 'venta de producto, subvencion, etc' },
          importe: { type: 'number', description: 'Importe en EUR' },
          kg_vendidos: { type: 'number' },
          precio_kg: { type: 'number' }
        },
        required: ['finca_id', 'fecha', 'concepto', 'categoria', 'importe']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'consultar_meteo',
      description: 'Consultar datos meteorologicos historicos y pronostico AEMET de una finca',
      parameters: {
        type: 'object',
        properties: {
          finca_id: { type: 'number' },
          dias: { type: 'number', description: 'Numero de dias de historial, default 7' }
        },
        required: ['finca_id']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'consultar_produccion',
      description: 'Consultar produccion historica por bancal o finca',
      parameters: {
        type: 'object',
        properties: {
          finca_id: { type: 'number' },
          bancal_id: { type: 'number' }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'consultar_economia',
      description: 'Consultar resumen economico: gastos, ingresos y beneficio de una finca',
      parameters: {
        type: 'object',
        properties: {
          finca_id: { type: 'number' }
        },
        required: ['finca_id']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'crear_alerta',
      description: 'Crear una alerta o recordatorio para el agricultor',
      parameters: {
        type: 'object',
        properties: {
          tipo: { type: 'string', description: 'helada, riego, plaga, cosecha, stock, otro' },
          severidad: { type: 'string', description: 'info, aviso, critico' },
          titulo: { type: 'string' },
          mensaje: { type: 'string' },
          finca_id: { type: 'number' }
        },
        required: ['tipo', 'titulo', 'mensaje']
      }
    }
  }
];

const TOOLS_BY_CONTEXT = {
  dashboard: ['consultar_fincas', 'consultar_produccion', 'consultar_economia', 'consultar_meteo', 'crear_alerta'],
  fincas: ['consultar_fincas', 'crear_finca', 'consultar_bancales', 'crear_bancal'],
  finca_detalle: ['consultar_bancales', 'crear_bancal', 'consultar_produccion', 'consultar_economia', 'registrar_gasto', 'registrar_ingreso'],
  bancal_detalle: ['registrar_riego', 'consultar_riegos', 'registrar_abonado', 'registrar_tratamiento', 'registrar_poda', 'registrar_cosecha', 'consultar_meteo', 'consultar_produccion', 'crear_alerta'],
  meteo: ['consultar_meteo', 'crear_alerta'],
  economia: ['registrar_gasto', 'registrar_ingreso', 'consultar_economia', 'consultar_produccion'],
  maquinaria: ['consultar_fincas'],
  inventario: ['consultar_fincas'],
  productos: ['consultar_fincas'],
  calendario: ['consultar_meteo', 'crear_alerta'],
  informes: ['consultar_produccion', 'consultar_economia', 'consultar_riegos'],
  global: ALL_TOOLS.map(t => t.function.name)
};

function getToolsForContext(contextoPantalla) {
  const allowed = TOOLS_BY_CONTEXT[contextoPantalla] || TOOLS_BY_CONTEXT.global;
  return ALL_TOOLS.filter(t => allowed.includes(t.function.name));
}

const TOOL_EXECUTORS = {
  consultar_fincas: async (params, userId) => {
    const fincas = await prisma.finca.findMany({
      include: { _count: { select: { bancales: true } } },
      orderBy: { nombre: 'asc' }
    });
    return { fincas: fincas.map(f => ({ id: f.id, nombre: f.nombre, tipo_cultivo: f.tipo_cultivo, bancales: f._count.bancales, ubicacion: f.ubicacion })) };
  },
  crear_finca: async (params, userId) => {
    const finca = await prisma.finca.create({
      data: { nombre: params.nombre, tipo_cultivo: params.tipo_cultivo || 'olivo', ubicacion: params.ubicacion || null, altitud: params.altitud || null, superficie_total: params.superficie_total || null }
    });
    return { success: true, id: finca.id, message: `Finca "${finca.nombre}" creada correctamente` };
  },
  consultar_bancales: async (params) => {
    const bancales = await prisma.bancal.findMany({
      where: { finca_id: params.finca_id },
      include: { variedades: true },
      orderBy: { nombre: 'asc' }
    });
    return { bancales: bancales.map(b => ({ id: b.id, nombre: b.nombre, superficie: b.superficie, variedades: b.variedades.map(v => `${v.variedad}(${v.num_arboles})`) })) };
  },
  crear_bancal: async (params) => {
    const bancal = await prisma.bancal.create({
      data: { finca_id: params.finca_id, nombre: params.nombre, superficie: params.superficie || null, textura_suelo: params.textura_suelo || null, pendiente: params.pendiente || null, marco_plantacion: params.marco_plantacion || null }
    });
    return { success: true, id: bancal.id, message: `Bancal "${bancal.nombre}" creado correctamente` };
  },
  registrar_riego: async (params) => {
    const riego = await prisma.riego.create({
      data: { bancal_id: params.bancal_id, fecha_inicio: new Date(params.fecha_inicio), volumen_m3: params.volumen_m3 || null, observaciones: params.observaciones || null }
    });
    return { success: true, id: riego.id, message: `Riego registrado: ${params.volumen_m3 || '?'}m3` };
  },
  consultar_riegos: async (params) => {
    const riegos = await prisma.riego.findMany({
      where: { bancal_id: params.bancal_id },
      orderBy: { fecha_inicio: 'desc' },
      take: params.limite || 10
    });
    return { riegos: riegos.map(r => ({ fecha: r.fecha_inicio, volumen: r.volumen_m3 })) };
  },
  registrar_abonado: async (params) => {
    const abonado = await prisma.abonado.create({
      data: { bancal_id: params.bancal_id, fecha: new Date(params.fecha), tipo: params.tipo, npk: params.npk || null, dosis: params.dosis || null, dosis_unidad: params.dosis_unidad || null, estado_fenologico: params.estado_fenologico || null, observaciones: params.observaciones || null }
    });
    return { success: true, id: abonado.id, message: `Abonado registrado: ${params.tipo} ${params.npk || ''}` };
  },
  registrar_tratamiento: async (params) => {
    const tratamiento = await prisma.tratamiento.create({
      data: { bancal_id: params.bancal_id, fecha: new Date(params.fecha), plaga_enfermedad: params.plaga_enfermedad || null, dosis: params.dosis || null, periodo_seguridad_dias: params.periodo_seguridad_dias || null, observaciones: params.observaciones || null }
    });
    return { success: true, id: tratamiento.id, message: `Tratamiento registrado: ${params.plaga_enfermedad || 'N/A'}` };
  },
  registrar_poda: async (params) => {
    const poda = await prisma.poda.create({
      data: { bancal_id: params.bancal_id, fecha: new Date(params.fecha), tipo: params.tipo, volumen_lena_kg: params.volumen_lena_kg || null, observaciones: params.observaciones || null }
    });
    return { success: true, id: poda.id, message: `Poda registrada: ${params.tipo}` };
  },
  registrar_cosecha: async (params) => {
    const cosecha = await prisma.cosecha.create({
      data: { bancal_id: params.bancal_id, fecha: new Date(params.fecha), metodo_recoleccion: params.metodo_recoleccion || 'manual', kg_totales: params.kg_totales, rendimiento_graso_pct: params.rendimiento_graso_pct || null, almazara: params.almazara || null }
    });
    return { success: true, id: cosecha.id, message: `Cosecha registrada: ${params.kg_totales}kg` };
  },
  registrar_gasto: async (params) => {
    const gasto = await prisma.gasto.create({
      data: { finca_id: params.finca_id, fecha: new Date(params.fecha), concepto: params.concepto, categoria: params.categoria, importe: params.importe, observaciones: params.observaciones || null }
    });
    return { success: true, id: gasto.id, message: `Gasto registrado: ${params.importe}EUR (${params.concepto})` };
  },
  registrar_ingreso: async (params) => {
    const ingreso = await prisma.ingreso.create({
      data: { finca_id: params.finca_id, fecha: new Date(params.fecha), concepto: params.concepto, categoria: params.categoria, importe: params.importe, kg_vendidos: params.kg_vendidos || null, precio_kg: params.precio_kg || null }
    });
    return { success: true, id: ingreso.id, message: `Ingreso registrado: ${params.importe}EUR (${params.concepto})` };
  },
  consultar_meteo: async (params) => {
    const aemetService = require('./aemet.service');
    let prediccion = [];
    try { prediccion = await aemetService.getPrediccionSemana(); } catch (e) { }
    const historial = await prisma.meteoDatos.findMany({
      where: { finca_id: params.finca_id },
      orderBy: { fecha: 'desc' },
      take: params.dias || 7
    });
    return {
      prediccion: prediccion.slice(0, 7),
      historial: historial.map(d => ({ fecha: d.fecha, temp_max: d.temp_max, temp_min: d.temp_min, lluvia: d.lluvia_mm, fuente: d.fuente }))
    };
  },
  consultar_produccion: async (params) => {
    const where = params.bancal_id ? { bancal_id: params.bancal_id } : { bancal: { finca_id: params.finca_id } };
    const cosechas = await prisma.cosecha.findMany({
      where,
      include: { bancal: { select: { nombre: true } } },
      orderBy: { fecha: 'desc' }
    });
    return {
      total_kg: cosechas.reduce((s, c) => s + c.kg_totales, 0),
      cosechas: cosechas.map(c => ({ bancal: c.bancal.nombre, fecha: c.fecha, kg: c.kg_totales, rendimiento: c.rendimiento_graso_pct }))
    };
  },
  consultar_economia: async (params) => {
    const [gastos, ingresos] = await Promise.all([
      prisma.gasto.findMany({ where: { finca_id: params.finca_id } }),
      prisma.ingreso.findMany({ where: { finca_id: params.finca_id } })
    ]);
    const totalGastos = gastos.reduce((s, g) => s + g.importe, 0);
    const totalIngresos = ingresos.reduce((s, i) => s + i.importe, 0);
    const gastosPorCat = {};
    gastos.forEach(g => { gastosPorCat[g.categoria] = (gastosPorCat[g.categoria] || 0) + g.importe; });
    return {
      total_gastos: totalGastos,
      total_ingresos: totalIngresos,
      beneficio: totalIngresos - totalGastos,
      gastos_por_categoria: gastosPorCat,
      num_gastos: gastos.length,
      num_ingresos: ingresos.length
    };
  },
  crear_alerta: async (params, userId) => {
    const alerta = await prisma.alertaIA.create({
      data: { usuario_id: userId, finca_id: params.finca_id || null, tipo: params.tipo, severidad: params.severidad || 'info', titulo: params.titulo, mensaje: params.mensaje }
    });
    return { success: true, id: alerta.id, message: `Alerta creada: ${params.titulo}` };
  }
};

async function executeTools(toolCalls, userId) {
  const results = [];
  for (const call of toolCalls) {
    const fnName = call.function.name;
    let params = {};
    try { params = JSON.parse(call.function.arguments || '{}'); } catch (e) { }
    const executor = TOOL_EXECUTORS[fnName];

    if (!executor) {
      results.push({ tool_call_id: call.id, content: JSON.stringify({ error: `Herramienta ${fnName} no encontrada` }) });
      await auditoriaService.log(userId, 'tool_execute', fnName, params, null, false, 'Herramienta no encontrada');
      continue;
    }

    try {
      const result = await executor(params, userId);
      results.push({ tool_call_id: call.id, content: JSON.stringify(result) });
      await auditoriaService.log(userId, 'tool_execute', fnName, params, result, true);
    } catch (err) {
      results.push({ tool_call_id: call.id, content: JSON.stringify({ error: err.message }) });
      await auditoriaService.log(userId, 'tool_execute', fnName, params, null, false, err.message);
    }
  }
  return results;
}

module.exports = { getToolsForContext, executeTools, ALL_TOOLS };
