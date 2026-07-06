const { Router } = require('express');
const cosechaController = require('../controllers/cosecha.controller');
const validate = require('../middleware/validate');
const Joi = require('joi');

const cosechaSchema = Joi.object({
  fecha: Joi.alternatives().try(Joi.string().isoDate(), Joi.date().iso()).required(),
  metodo_recoleccion: Joi.string().max(50).required(),
  kg_totales: Joi.number().positive().required(),
  rendimiento_graso_pct: Joi.number().min(0).max(100).allow(null),
  almazara: Joi.string().max(200).allow(null, ''),
  observaciones: Joi.string().allow(null, '')
});

const router = Router({ mergeParams: true });

router.get('/', cosechaController.obtenerTodos);
router.get('/:id', cosechaController.obtenerPorId);
router.post('/', validate(cosechaSchema), cosechaController.crear);
router.put('/:id', validate(cosechaSchema), cosechaController.actualizar);
router.delete('/:id', cosechaController.eliminar);

module.exports = router;