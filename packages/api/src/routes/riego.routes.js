const { Router } = require('express');
const riegoController = require('../controllers/riego.controller');
const validate = require('../middleware/validate');
const Joi = require('joi');

const riegoSchema = Joi.object({
  fecha_inicio: Joi.alternatives().try(Joi.string().isoDate(), Joi.date().iso()).required(),
  fecha_fin: Joi.alternatives().try(Joi.string().isoDate(), Joi.date().iso()).allow(null, ''),
  volumen_m3: Joi.number().positive().allow(null),
  precipitacion_mm: Joi.number().allow(null),
  etp: Joi.number().allow(null),
  humedad_suelo_pct: Joi.number().min(0).max(100).allow(null),
  observaciones: Joi.string().allow(null, '')
});

const router = Router({ mergeParams: true });

router.get('/', riegoController.obtenerTodos);
router.get('/:id', riegoController.obtenerPorId);
router.post('/', validate(riegoSchema), riegoController.crear);
router.put('/:id', validate(riegoSchema), riegoController.actualizar);
router.delete('/:id', riegoController.eliminar);

module.exports = router;