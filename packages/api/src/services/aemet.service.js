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
    const prediccion = await datosRes.json();
    if (!Array.isArray(prediccion) || prediccion.length === 0) return [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const result = prediccion.filter(dia => new Date(dia.fecha) >= new Date(hoy.getTime() - 86400000)).slice(0, 7).map(dia => {
      const temp = dia.temperatura || {};
      const probPrecip = dia.probPrecipitacion || [];
      const estadoCielo = dia.estadoCielo || [];
      const humedad = dia.humedadRelativa || {};
      return {
        fecha: dia.fecha,
        temp_max: temp.maxima ?? null,
        temp_min: temp.minima ?? null,
        lluvia_mm: null,
        humedad_pct: humedad.maxima ?? null,
        viento: dia.viento?.velocidadMaxima?.length > 0 ? dia.viento.velocidadMaxima[0].valor : null,
        estado_cielo: estadoCielo.length > 0 ? estadoCielo[0].descripcion : null,
        prob_precipitacion: probPrecip.length > 0 ? probPrecip[0].valor : null,
        fuente: 'aemet'
      };
    });
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