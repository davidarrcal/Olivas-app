const AEMET_API_KEY = process.env.AEMET_API_KEY || '';
const AEMET_MUNICIPIO = process.env.AEMET_MUNICIPIO || '18098';

let cachePrediccion = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30 * 60 * 1000;

async function fetchAemetJson(url) {
  const res = await fetch(url, {
    headers: { 'api_key': AEMET_API_KEY }
  });
  if (!res.ok) {
    if (res.status === 429) throw new Error('AEMET: limite de peticiones excedido. Intentalo en 1-2 minutos.');
    throw new Error(`AEMET error ${res.status}`);
  }
  const json = await res.json();
  if (json.estado === 429) throw new Error('AEMET: limite de peticiones excedido. Intentalo en 1-2 minutos.');
  if (json.estado && json.estado !== 200) throw new Error(json.descripcion || `AEMET error ${json.estado}`);
  return json;
}

function parseDia(dia) {
  const temp = dia.temperatura || {};
  const st = dia.sensTermica || {};
  const probPrecip = dia.probPrecipitacion || [];
  const estadoCielo = dia.estadoCielo || [];
  const humedad = dia.humedadRelativa || [];
  const tempMax = temp.maxima ?? st.maxima ?? null;
  const tempMin = temp.minima ?? st.minima ?? null;

  const cieloPeriodo = estadoCielo.find(e => e.periodo === '12-24' || e.periodo === '00-24') ||
                       estadoCielo.find(e => e.descripcion && e.descripcion.trim() !== '') || 
                       estadoCielo[estadoCielo.length - 1] || {};

  const humedadMax = humedad.length > 0
    ? Math.max(...humedad.filter(h => h.value !== null && h.value !== '').map(h => Number(h.value)))
    : null;

  const precipValue = probPrecip.length > 0 ? probPrecip[0].value : null;
  const probPrecipValue = precipValue !== null && precipValue !== '' ? Number(precipValue) : null;

  return {
    fecha: dia.fecha,
    temp_max: tempMax,
    temp_min: tempMin,
    lluvia_mm: null,
    humedad_pct: isNaN(humedadMax) ? null : humedadMax,
    viento: dia.viento?.velocidad?.length > 0 ? dia.viento.velocidad[0]?.value ?? null : null,
    estado_cielo: cieloPeriodo.descripcion || null,
    prob_precipitacion: probPrecipValue,
    fuente: 'aemet'
  };
}

async function getPrediccionSemana() {
  if (!AEMET_API_KEY) return [];
  const now = Date.now();
  if (cachePrediccion && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachePrediccion;
  }
  try {
    const index = await fetchAemetJson(
      `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${AEMET_MUNICIPIO}`
    );
    if (!index.datos) return [];
    const datosRes = await fetch(index.datos);
    if (!datosRes.ok) throw new Error(`AEMET datos error ${datosRes.status}`);
    const body = await datosRes.json();
    if (!Array.isArray(body) || body.length === 0) return [];

    const prediccion = body[0];
    const dias = prediccion.prediccion?.dia || [];
    if (dias.length === 0) return [];

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const result = dias
      .filter(dia => new Date(dia.fecha) >= new Date(hoy.getTime() - 86400000))
      .slice(0, 7)
      .map(parseDia);

    cachePrediccion = result;
    cacheTimestamp = now;
    return result;
  } catch (err) {
    console.error('Error AEMET prediccion:', err.message);
    throw err;
  }
}

async function getPrediccionHoy() {
  const prediccion = await getPrediccionSemana();
  return prediccion.length > 0 ? prediccion[0] : null;
}

module.exports = { getPrediccionHoy, getPrediccionSemana };