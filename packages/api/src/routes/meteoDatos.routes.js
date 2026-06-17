const { Router } = require('express');
const meteoController = require('../controllers/meteoDatos.controller');
const aemetService = require('../services/aemet.service');
const validate = require('../middleware/validate');
const Joi = require('joi');

const meteoSchema = Joi.object({
  fecha: Joi.string().isoDate().required(),
  temp_max: Joi.number().allow(null),
  temp_min: Joi.number().allow(null),
  lluvia_mm: Joi.number().allow(null),
  humedad_pct: Joi.number().min(0).max(100).allow(null),
  fuente: Joi.string().valid('manual', 'aemet').default('manual'),
  observaciones: Joi.string().allow(null, '')
});

const router = Router({ mergeParams: true });

router.get('/resumen', meteoController.resumen);
router.get('/aemet', async (req, res) => {
  try {
    if (!process.env.AEMET_API_KEY) {
      return res.status(400).json({ error: 'AEMET_API_KEY no configurada', details: 'Anade AEMET_API_KEY en las variables de entorno de Render' });
    }
    const prediccion = await aemetService.getPrediccionSemana();
    res.json(prediccion);
  } catch (err) {
    res.status(502).json({ error: 'Error al obtener datos de AEMET', details: err.message });
  }
});
router.post('/importar-aemet', async (req, res) => {
  try {
    if (!process.env.AEMET_API_KEY) {
      return res.status(400).json({ error: 'AEMET_API_KEY no configurada. Anadela en las variables de entorno de Render.', details: 'AEMET_API_KEY is empty' });
    }
    const datos = await aemetService.getPrediccionHoy();
    if (!datos) return res.status(502).json({ error: 'No se pudieron obtener datos de AEMET. Intentalo en unos minutos (rate limit).', details: 'AEMET returned no data' });
    const prisma = require('../prisma');
    const fincaId = Number(req.params.fincaId);
    const fecha = new Date(datos.fecha);
    const existente = await prisma.meteoDatos.findFirst({
      where: { finca_id: fincaId, fecha, fuente: 'aemet' }
    });
    let registro;
    if (existente) {
      registro = await prisma.meteoDatos.update({
        where: { id: existente.id },
        data: {
          temp_max: datos.temp_max,
          temp_min: datos.temp_min,
          lluvia_mm: datos.lluvia_mm,
          humedad_pct: datos.humedad_pct
        }
      });
    } else {
      registro = await prisma.meteoDatos.create({
        data: {
          finca_id: fincaId,
          fecha,
          temp_max: datos.temp_max,
          temp_min: datos.temp_min,
          lluvia_mm: datos.lluvia_mm,
          humedad_pct: datos.humedad_pct,
          fuente: 'aemet'
        }
      });
    }
    res.json(registro);
  } catch (err) {
    res.status(500).json({ error: 'Error al importar datos de AEMET', details: err.message });
  }
});
router.get('/', meteoController.obtenerTodos);
router.get('/:id', meteoController.obtenerPorId);
router.post('/', validate(meteoSchema), meteoController.crear);
router.put('/:id', validate(meteoSchema), meteoController.actualizar);
router.delete('/:id', meteoController.eliminar);

module.exports = router;