const { Router } = require('express');
const maquinariaController = require('../controllers/maquinaria.controller');
const validate = require('../middleware/validate');
const Joi = require('joi');

const maquinariaSchema = Joi.object({
  finca_id: Joi.number().integer().required(),
  nombre: Joi.string().max(150).required(),
  tipo: Joi.string().max(100).allow(null, ''),
  horas_actuales: Joi.number().allow(null),
  observaciones: Joi.string().allow(null, '')
});

const mantenimientoSchema = Joi.object({
  fecha: Joi.alternatives().try(Joi.string().isoDate(), Joi.date().iso()).required(),
  tipo: Joi.string().max(100).required(),
  descripcion: Joi.string().allow(null, ''),
  proximo_aviso_horas: Joi.number().allow(null),
  coste: Joi.number().positive().allow(null)
});

const router = Router({ mergeParams: true });

router.get('/', maquinariaController.obtenerTodos);
router.get('/:id', maquinariaController.obtenerPorId);
router.post('/', validate(maquinariaSchema), maquinariaController.crear);
router.put('/:id', validate(maquinariaSchema), maquinariaController.actualizar);
router.delete('/:id', maquinariaController.eliminar);
router.post('/:id/mantenimientos', validate(mantenimientoSchema), maquinariaController.crearMantenimiento);
router.delete('/:id/mantenimientos/:mantId', maquinariaController.eliminarMantenimiento);

module.exports = router;