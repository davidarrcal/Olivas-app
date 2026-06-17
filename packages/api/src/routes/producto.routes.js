const { Router } = require('express');
const productoController = require('../controllers/producto.controller');
const validate = require('../middleware/validate');
const Joi = require('joi');

const productoSchema = Joi.object({
  nombre: Joi.string().min(2).max(200).required(),
  tipo: Joi.string().valid('abono', 'fitosanitario', 'otro').required(),
  composicion: Joi.string().max(255).allow(null, ''),
  unidad_medida: Joi.string().max(20).required(),
  precio_unitario: Joi.number().positive().allow(null),
  observaciones: Joi.string().allow(null, '')
});

const router = Router();

router.get('/', productoController.obtenerTodos);
router.get('/:id', productoController.obtenerPorId);
router.post('/', validate(productoSchema), productoController.crear);
router.put('/:id', validate(productoSchema), productoController.actualizar);
router.delete('/:id', productoController.eliminar);

module.exports = router;