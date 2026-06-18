const { Router } = require('express');
const tratamientoController = require('../controllers/tratamiento.controller');
const validate = require('../middleware/validate');
const Joi = require('joi');

const tratamientoSchema = Joi.object({
  producto_id: Joi.number().integer().allow(null),
  fecha: Joi.alternatives().try(Joi.string().isoDate(), Joi.date().iso()).required(),
  dosis: Joi.string().max(100).allow(null, ''),
  periodo_seguridad_dias: Joi.number().integer().allow(null),
  plaga_enfermedad: Joi.string().max(200).allow(null, ''),
  observaciones: Joi.string().allow(null, '')
});

const router = Router({ mergeParams: true });

router.get('/', tratamientoController.obtenerTodos);
router.get('/:id', tratamientoController.obtenerPorId);
router.post('/', validate(tratamientoSchema), tratamientoController.crear);
router.put('/:id', validate(tratamientoSchema), tratamientoController.actualizar);
router.delete('/:id', tratamientoController.eliminar);

module.exports = router;