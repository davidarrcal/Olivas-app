const { Router } = require('express');
const gastoController = require('../controllers/gasto.controller');
const validate = require('../middleware/validate');
const Joi = require('joi');

const gastoSchema = Joi.object({
  finca_id: Joi.number().integer().required(),
  bancal_id: Joi.number().integer().allow(null),
  fecha: Joi.alternatives().try(Joi.string().isoDate(), Joi.date().iso()).required(),
  concepto: Joi.string().max(255).required(),
  categoria: Joi.string().max(50).required(),
  importe: Joi.number().positive().required(),
  observaciones: Joi.string().allow(null, '')
});

const router = Router({ mergeParams: true });

router.get('/resumen', gastoController.resumen);
router.get('/', gastoController.obtenerTodos);
router.get('/:id', gastoController.obtenerPorId);
router.post('/', validate(gastoSchema), gastoController.crear);
router.put('/:id', validate(gastoSchema), gastoController.actualizar);
router.delete('/:id', gastoController.eliminar);

module.exports = router;