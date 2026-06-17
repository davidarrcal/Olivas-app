const AEMET_API_KEY = process.env.AEMET_API_KEY || '';
const AEMET_MUNICIPIO = process.env.AEMET_MUNICIPIO || '18098';
const AEMET_BASE = 'https://opendata.aemet.es/opendata';

async function fetchAemet(url) {
  const res = await fetch(url, {
    headers: { 'api_key': AEMET_API_KEY }
  });
  if (!res.ok) throw new Error(`AEMET error ${res.status}: ${res.statusText}`);
  const json = await res.json();
  if (json.datos) {
    const datosRes = await fetch(json.datos);
    return await datosRes.json();
  }
  if (json.estado === 200 && Array.isArray(json)) return json;
  throw new Error(json.descripcion || 'Error desconocido AEMET');
}

async function getPrediccionSemana() {
  if (!AEMET_API_KEY) return [];
  try {
    const prediccion = await fetchAemet(
      `${AEMET_BASE}/prediccion/especifica/municipio/diaria/${AEMET_MUNICIPIO}`
    );
    if (!prediccion || !prediccion.length) return [];
    const hoy = new Date();
    return prediccion.filter(dia => new Date(dia.fecha) >= new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 1)).slice(0, 7).map(dia => {
      const temp = dia.temperatura || {};
      const probPrecip = dia.probPrecipitacion || [];
      const estadoCielo = dia.estadoCielo || [];
      return {
        fecha: dia.fecha,
        temp_max: temp.maxima ?? null,
        temp_min: temp.minima ?? null,
        lluvia_mm: dia.precipitacion ? dia.precipitacion.valor ?? null : null,
        humedad_pct: dia.humedadRelativa ? dia.humedadRelativa.maxima ?? null : null,
        viento: dia.viento ? dia.viento.velocidadMaxima ?? null : null,
        estado_cielo: estadoCielo.length > 0 ? estadoCielo[0].descripcion : null,
        prob_precipitacion: probPrecip.length > 0 ? probPrecip[0].valor : null,
        fuente: 'aemet'
      };
    });
  } catch (err) {
    console.error('Error AEMET prediccion:', err.message);
    return [];
  }
}

async function getPrediccionHoy() {
  const prediccion = await getPrediccionSemana();
  return prediccion.length > 0 ? prediccion[0] : null;
}

module.exports = { getPrediccionHoy, getPrediccionSemana };