const { Router } = require('express');
const ingresoController = require('../controllers/ingreso.controller');
const validate = require('../middleware/validate');
const Joi = require('joi');

const ingresoSchema = Joi.object({
  finca_id: Joi.number().integer().required(),
  fecha: Joi.alternatives().try(Joi.string().isoDate(), Joi.date().iso()).required(),
  concepto: Joi.string().max(255).required(),
  categoria: Joi.string().max(50).required(),
  importe: Joi.number().positive().required(),
  kg_vendidos: Joi.number().positive().allow(null),
  precio_kg: Joi.number().positive().allow(null),
  observaciones: Joi.string().allow(null, '')
});

const router = Router({ mergeParams: true });

router.get('/resumen', ingresoController.resumen);
router.get('/', ingresoController.obtenerTodos);
router.get('/:id', ingresoController.obtenerPorId);
router.post('/', validate(ingresoSchema), ingresoController.crear);
router.put('/:id', validate(ingresoSchema), ingresoController.actualizar);
router.delete('/:id', ingresoController.eliminar);

module.exports = router;