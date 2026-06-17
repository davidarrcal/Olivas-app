const { Router } = require('express');
const meteoController = require('../controllers/meteoDatos.controller');
const validate = require('../middleware/validate');
const Joi = require('joi');

const meteoSchema = Joi.object({
  fecha: Joi.string().isoDate().required(),
  temp_max: Joi.number().allow(null),
  temp_min: Joi.number().allow(null),
  lluvia_mm: Joi.number().allow(null),
  humedad_pct: Joi.number().min(0).max(100).allow(null),
  fuente: Joi.string().valid('manual', 'api').default('manual'),
  observaciones: Joi.string().allow(null, '')
});

const router = Router({ mergeParams: true });

router.get('/resumen', meteoController.resumen);
router.get('/', meteoController.obtenerTodos);
router.get('/:id', meteoController.obtenerPorId);
router.post('/', validate(meteoSchema), meteoController.crear);
router.put('/:id', validate(meteoSchema), meteoController.actualizar);
router.delete('/:id', meteoController.eliminar);

module.exports = router;