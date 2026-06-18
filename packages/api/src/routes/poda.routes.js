const { Router } = require('express');
const podaController = require('../controllers/poda.controller');
const validate = require('../middleware/validate');
const Joi = require('joi');

const podaSchema = Joi.object({
  fecha: Joi.alternatives().try(Joi.string().isoDate(), Joi.date().iso()).required(),
  tipo: Joi.string().valid('formacion', 'fructificacion', 'renovacion', 'sanitaria').required(),
  volumen_lena_kg: Joi.number().positive().allow(null),
  observaciones: Joi.string().allow(null, '')
});

const router = Router({ mergeParams: true });

router.get('/', podaController.obtenerTodos);
router.get('/:id', podaController.obtenerPorId);
router.post('/', validate(podaSchema), podaController.crear);
router.put('/:id', validate(podaSchema), podaController.actualizar);
router.delete('/:id', podaController.eliminar);

module.exports = router;