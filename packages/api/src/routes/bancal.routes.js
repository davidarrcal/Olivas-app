const { Router } = require('express');
const bancalController = require('../controllers/bancal.controller');
const variedadController = require('../controllers/variedadBancal.controller');
const validate = require('../middleware/validate');
const Joi = require('joi');

const bancalSchema = Joi.object({
  finca_id: Joi.number().integer().required(),
  nombre: Joi.string().min(2).max(150).required(),
  superficie: Joi.number().positive().allow(null),
  textura_suelo: Joi.string().valid('arcilloso', 'franco_arcilloso', 'franco', 'franco_arenoso', 'arenoso').allow('', null),
  pendiente: Joi.number().min(0).max(100).allow(null),
  marco_plantacion: Joi.string().max(20).allow('', null),
  observaciones: Joi.string().allow('', null)
});

const variedadSchema = Joi.object({
  variedad: Joi.string().max(100).required(),
  num_arboles: Joi.number().integer().positive().required(),
  ano_plantacion: Joi.number().integer().min(1800).max(2100).allow(null),
  produccion_estimada: Joi.number().positive().allow(null),
  observaciones: Joi.string().allow('', null)
});

const router = Router({ mergeParams: true });

router.get('/', bancalController.obtenerTodos);
router.get('/:id', bancalController.obtenerPorId);
router.post('/', validate(bancalSchema), bancalController.crear);
router.put('/:id', validate(bancalSchema), bancalController.actualizar);
router.delete('/:id', bancalController.eliminar);

router.get('/:bancalId/variedades', variedadController.obtenerTodos);
router.post('/:bancalId/variedades', validate(variedadSchema), variedadController.crear);
router.put('/:bancalId/variedades/:id', validate(variedadSchema), variedadController.actualizar);
router.delete('/:bancalId/variedades/:id', variedadController.eliminar);

module.exports = router;