const { Router } = require('express');
const diarioController = require('../controllers/diarioCampo.controller');
const validate = require('../middleware/validate');
const Joi = require('joi');

const diarioSchema = Joi.object({
  fecha: Joi.alternatives().try(Joi.string().isoDate(), Joi.date().iso()).required(),
  horas: Joi.number().positive().allow(null),
  tipo_labor: Joi.string().max(100).allow(null, ''),
  descripcion: Joi.string().allow(null, ''),
  fotos: Joi.allow(null)
});

const router = Router({ mergeParams: true });

router.get('/', diarioController.obtenerTodos);
router.get('/:id', diarioController.obtenerPorId);
router.post('/', validate(diarioSchema), diarioController.crear);
router.put('/:id', validate(diarioSchema), diarioController.actualizar);
router.delete('/:id', diarioController.eliminar);

module.exports = router;