const prisma = require('../prisma');

const CULTIVOS_INFO = {
  olivo: { label: 'Olivar', labelLargo: 'Olivar' },
  almendro: { label: 'Almendral', labelLargo: 'Almendral' },
  citricos: { label: 'Citrico', labelLargo: 'Citrico' },
  vid: { label: 'Vinedo', labelLargo: 'Vinedo' },
  pistacho: { label: 'Pistachar', labelLargo: 'Pistachar' },
  frutales: { label: 'Frutales', labelLargo: 'Frutales' },
  otro: { label: 'Cultivo personalizado', labelLargo: 'Cultivo personalizado' }
};

async function buildContext({ userId, contextoPantalla, entidadId }) {
  const usuario = await prisma.usuario.findUnique({ where: { id: userId } });
  const nombreUsuario = usuario ? usuario.nombre : 'Agricultor';

  let systemPrompt = `Eres un asesor agricola experto integrado en la app "Gestion de Campo".
Responde en espanol, de forma clara y concisa (max 300 palabras).
Eres un ingeniero agronomo, meteorologo y asistente tecnico.
Siempre explica el MOTIVO de tus recomendaciones.
Cuando ejecutes una accion, confirma al usuario que hiciste.
Eres experto en: olivo, almendro, citricos, vid, pistacho, frutales y otros cultivos.
Conoces sobre riego, fertilizacion, plagas, enfermedades, cosecha, poda, analisis de suelo, economia agricola y calendario agricola.

IMPORTANTE SOBRE HERRAMIENTAS (TOOLS):
- SOLO puedes usar las herramientas que aparecen en la lista de tools proporcionada.
- NO inventes nombres de herramientas. Si necesitas algo que no esta disponible, responde con tu conocimiento.
- Los nombres de herramientas disponibles son: consultar_fincas, crear_finca, consultar_bancales, crear_bancal, registrar_riego, consultar_riegos, registrar_abonado, registrar_tratamiento, registrar_poda, registrar_cosecha, registrar_gasto, registrar_ingreso, consultar_meteo, calcular_riego, consultar_produccion, consultar_economia, consultar_calendario, crear_alerta.
- NUNCA uses un nombre de herramienta que no este en esta lista.

Usuario: ${nombreUsuario}
Fecha actual: ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
`;

  try {
    switch (contextoPantalla) {
      case 'dashboard': {
        const fincas = await prisma.finca.findMany({
          where: { usuario_id: userId },
          include: { _count: { select: { bancales: true } } },
          orderBy: { nombre: 'asc' }
        });
        if (fincas.length > 0) {
          systemPrompt += `\nFincas del usuario:\n${fincas.map(f => {
            const cult = CULTIVOS_INFO[f.tipo_cultivo] || CULTIVOS_INFO.otro;
            return `- ${f.nombre} (${cult.label}, ${f._count.bancales} bancales, ${f.ubicacion || 'sin ubicacion'})`;
          }).join('\n')}`;
        }
        break;
      }

      case 'fincas': {
        const fincas = await prisma.finca.findMany({
          where: { usuario_id: userId },
          include: { _count: { select: { bancales: true } } },
          orderBy: { nombre: 'asc' }
        });
        if (fincas.length > 0) {
          systemPrompt += `\nFincas:\n${fincas.map(f => {
            const cult = CULTIVOS_INFO[f.tipo_cultivo] || CULTIVOS_INFO.otro;
            return `- ID:${f.id} | ${f.nombre} (${cult.label}, ${f._count.bancales} bancales)`;
          }).join('\n')}`;
        }
        break;
      }

      case 'finca_detalle': {
        const finca = await prisma.finca.findFirst({
          where: { id: entidadId, usuario_id: userId },
          include: {
            bancales: { orderBy: { nombre: 'asc' }, include: { _count: { select: { riegos: true, abonados: true, tratamientos: true, cosechas: true } } } }
          }
        });
        if (finca) {
          const cult = CULTIVOS_INFO[finca.tipo_cultivo] || CULTIVOS_INFO.otro;
          systemPrompt += `\nCONTEXTO ACTUAL:
Finca: ${finca.nombre} (ID:${finca.id}, ${cult.labelLargo}, ${finca.ubicacion || 'sin ubicacion'}, altitud ${finca.altitud || '?'}m, ${finca.superficie_total || '?'} ha)
Bancales: ${finca.bancales.map(b => `${b.nombre}(ID:${b.id}, ${b._count.riegos}R/${b._count.abonados}A/${b._count.tratamientos}T/${b._count.cosechas}C)`).join(', ')}
`;
        }
        break;
      }

      case 'bancal_detalle': {
        const bancal = await prisma.bancal.findFirst({
          where: { id: entidadId, finca: { usuario_id: userId } },
          include: {
            finca: true,
            variedades: true,
            riegos: { orderBy: { fecha_inicio: 'desc' }, take: 3 },
            abonados: { orderBy: { fecha: 'desc' }, take: 3, include: { producto: true } },
            tratamientos: { orderBy: { fecha: 'desc' }, take: 3, include: { producto: true } },
            cosechas: { orderBy: { fecha: 'desc' }, take: 2 }
          }
        });
        if (bancal) {
          const cult = CULTIVOS_INFO[bancal.finca.tipo_cultivo] || CULTIVOS_INFO.otro;
          systemPrompt += `\nCONTEXTO ACTUAL:
Finca: ${bancal.finca.nombre} (ID:${bancal.finca.id}, ${cult.labelLargo}, ${bancal.finca.ubicacion || ''}, altitud ${bancal.finca.altitud || '?'}m)
Bancal: ${bancal.nombre} (ID:${bancal.id}, ${bancal.superficie || '?'} ha, pendiente ${bancal.pendiente || '?'}%, suelo ${bancal.textura_suelo || '?'})
Variedades: ${bancal.variedades.map(v => `${v.variedad} (${v.num_arboles} arboles)`).join(', ') || 'ninguna'}

Riegos recientes:
${bancal.riegos.length > 0 ? bancal.riegos.map(r => `- ${fmtDate(r.fecha_inicio)}: ${r.volumen_m3 || '?'}m3`).join('\n') : '- Sin riegos registrados'}

Abonados recientes:
${bancal.abonados.length > 0 ? bancal.abonados.map(a => `- ${fmtDate(a.fecha)}: ${a.tipo} ${a.npk || ''} ${a.producto ? '(' + a.producto.nombre + ')' : ''}`).join('\n') : '- Sin abonados'}

Tratamientos recientes:
${bancal.tratamientos.length > 0 ? bancal.tratamientos.map(t => `- ${fmtDate(t.fecha)}: ${t.plaga_enfermedad || 'N/A'} ${t.producto ? '(' + t.producto.nombre + ')' : ''} (seguridad: ${t.periodo_seguridad_dias || '?'} dias)`).join('\n') : '- Sin tratamientos'}

Cosechas recientes:
${bancal.cosechas.length > 0 ? bancal.cosechas.map(c => `- ${fmtDate(c.fecha)}: ${c.kg_totales}kg, ${c.rendimiento_graso_pct || '?'}% graso`).join('\n') : '- Sin cosechas'}
`;
        }
        break;
      }

      case 'meteo': {
        const meteoData = await prisma.meteoDatos.findMany({
          where: { finca: { id: entidadId, usuario_id: userId } },
          orderBy: { fecha: 'desc' }, take: 7
        });
        systemPrompt += `\nDATOS METEOROLOGICOS (ultimos 7 dias):
${meteoData.length > 0 ? meteoData.map(d => `- ${fmtDate(d.fecha)}: ${d.temp_max || '?'}C/${d.temp_min || '?'}C, lluvia: ${d.lluvia_mm || 0}mm, humedad: ${d.humedad_pct || '?'}% (${d.fuente})`).join('\n') : '- Sin datos registrados'}
`;
        break;
      }

      case 'economia': {
        const fincas = await prisma.finca.findMany({ where: { usuario_id: userId }, orderBy: { nombre: 'asc' } });
        const fincaId = entidadId || (fincas.length > 0 ? fincas[0].id : null);
        if (fincaId) {
          const [gastos, ingresos] = await Promise.all([
            prisma.gasto.findMany({ where: { finca: { id: fincaId, usuario_id: userId } }, orderBy: { fecha: 'desc' }, take: 10 }),
            prisma.ingreso.findMany({ where: { finca: { id: fincaId, usuario_id: userId } }, orderBy: { fecha: 'desc' }, take: 10 })
          ]);
          const totalGastos = gastos.reduce((s, g) => s + g.importe, 0);
          const totalIngresos = ingresos.reduce((s, i) => s + i.importe, 0);
          const grupos = {};
          gastos.forEach(g => { grupos[g.categoria] = (grupos[g.categoria] || 0) + g.importe; });
          systemPrompt += `\nCONTEXTO ECONOMICO (Finca ID:${fincaId}):
Gastos: ${totalGastos.toFixed(2)}EUR (${gastos.length} registros)
Ingresos: ${totalIngresos.toFixed(2)}EUR (${ingresos.length} registros)
Resultado: ${(totalIngresos - totalGastos).toFixed(2)}EUR
Gastos por categoria: ${Object.entries(grupos).map(([k, v]) => `${k}:${v.toFixed(2)}EUR`).join(', ')}
`;
        }
        break;
      }

      case 'calendario': {
        const fincas = await prisma.finca.findMany({ where: { usuario_id: userId }, orderBy: { nombre: 'asc' } });
        if (fincas.length > 0) {
          const f = fincas[0];
          const cult = CULTIVOS_INFO[f.tipo_cultivo] || CULTIVOS_INFO.otro;
          const mes = new Date().getMonth();
          const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
          systemPrompt += `\nCONTEXTO CALENDARIO:
Finca: ${f.nombre} (${cult.labelLargo})
Mes actual: ${meses[mes]}
`;
        }
        break;
      }

      case 'informes': {
        const fincas = await prisma.finca.findMany({ where: { usuario_id: userId }, orderBy: { nombre: 'asc' } });
        const fincaId = entidadId || (fincas.length > 0 ? fincas[0].id : null);
        if (fincaId) {
          const bancales = await prisma.bancal.findMany({ where: { finca: { id: fincaId, usuario_id: userId } } });
          let totalKg = 0, totalAgua = 0;
          for (const b of bancales) {
            const cs = await prisma.cosecha.findMany({ where: { bancal_id: b.id } });
            const rs = await prisma.riego.findMany({ where: { bancal_id: b.id } });
            totalKg += cs.reduce((s, c) => s + c.kg_totales, 0);
            totalAgua += rs.reduce((s, r) => s + (r.volumen_m3 || 0), 0);
          }
          const [gastos, ingresos] = await Promise.all([
            prisma.gasto.aggregate({ _sum: { importe: true }, where: { finca: { id: fincaId, usuario_id: userId } } }),
            prisma.ingreso.aggregate({ _sum: { importe: true }, where: { finca: { id: fincaId, usuario_id: userId } } })
          ]);
          systemPrompt += `\nCONTEXTO INFORMES (Finca ID:${fincaId}):
Produccion total: ${totalKg} kg
Agua total: ${totalAgua} m3
Gastos totales: ${(gastos._sum.importe || 0).toFixed(2)}EUR
Ingresos totales: ${(ingresos._sum.importe || 0).toFixed(2)}EUR
`;
        }
        break;
      }
    }

    if (contextoPantalla !== 'meteo') {
      try {
        const aemetService = require('./aemet.service');
        const prediccion = await aemetService.getPrediccionSemana();
        if (prediccion && prediccion.length > 0) {
          const hoy = prediccion[0];
          systemPrompt += `\nPRONOSTICO AEMET HOY: ${hoy.temp_max || '?'}C max / ${hoy.temp_min || '?'}C min, precip: ${hoy.prob_precipitacion ?? '?'}%, cielo: ${hoy.estado_cielo || 'N/A'}`;
          if (prediccion.length > 1) {
            systemPrompt += `\nProximos 3 dias: ${prediccion.slice(1, 4).map(p => `${fmtDate(p.fecha).split('/')[0]}/${fmtDate(p.fecha).split('/')[1]}: ${p.temp_max || '?'}C/${p.temp_min || '?'}C`).join(', ')}`;
          }
        }
      } catch (e) { }
    }
  } catch (err) {
    console.error('Error construyendo contexto IA:', err.message);
  }

  return { systemPrompt, usuario };
}

function fmtDate(d) {
  if (!d) return '?';
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

module.exports = { buildContext };
