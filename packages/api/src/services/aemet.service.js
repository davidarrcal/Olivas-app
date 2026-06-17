const AEMET_API_KEY = process.env.AEMET_API_KEY || '';
const AEMET_MUNICIPIO = process.env.AEMET_MUNICIPIO || '18098';
const AEMET_BASE = 'https://opendata.aemet.es/opendapi/api';

async function fetchAemet(url) {
  const res = await fetch(url, {
    headers: { 'api_key': AEMET_API_KEY }
  });
  if (!res.ok) throw new Error(`AEMET error ${res.status}`);
  const data = await res.json();
  if (data.datos) {
    const datosRes = await fetch(data.datos);
    return await datosRes.json();
  }
  return data;
}

async function getPrediccionHoy() {
  if (!AEMET_API_KEY) return null;
  try {
    const prediccion = await fetchAemet(
      `${AEMET_BASE}/prediccion/especifica/municipio/diaria/${AEMET_MUNICIPIO}`
    );
    if (!prediccion || !prediccion.length) return null;
    const hoy = prediccion[0];
    return {
      fecha: hoy.fecha,
      temp_max: hoy.temperatura?.maxima ?? null,
      temp_min: hoy.temperatura?.minima ?? null,
      lluvia_mm: hoy.precipitacion?.valor ?? null,
      humedad_pct: hoy.humedadRelativa?.maxima ?? null,
      viento: hoy.viento?. velocidadMaxima ?? null,
      estado_cielo: hoy.estadoCielo?.[0]?.descripcion ?? null,
      fuente: 'aemet',
      origen: 'AEMET Zujar (Granada)'
    };
  } catch (err) {
    console.error('Error AEMET prediccion:', err.message);
    return null;
  }
}

async function getPrediccionSemana() {
  if (!AEMET_API_KEY) return [];
  try {
    const prediccion = await fetchAemet(
      `${AEMET_BASE}/prediccion/especifica/municipio/diaria/${AEMET_MUNICIPIO}`
    );
    if (!prediccion || !prediccion.length) return [];
    return prediccion.map(dia => ({
      fecha: dia.fecha,
      temp_max: dia.temperatura?.maxima ?? null,
      temp_min: dia.temperatura?.minima ?? null,
      lluvia_mm: dia.precipitacion?.valor ?? null,
      humedad_pct: dia.humedadRelativa?.maxima ?? null,
      viento: dia.viento?. velocidadMaxima ?? null,
      estado_cielo: dia.estadoCielo?.[0]?.descripcion ?? null,
      prob_precipitacion: dia.probPrecipitacion?.[0]?.valor ?? null,
      fuente: 'aemet'
    }));
  } catch (err) {
    console.error('Error AEMET semana:', err.message);
    return [];
  }
}

module.exports = { getPrediccionHoy, getPrediccionSemana };