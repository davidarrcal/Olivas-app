const { Router } = require('express');
const inventarioController = require('../controllers/inventario.controller');
const validate = require('../middleware/validate');
const Joi = require('joi');

const inventarioSchema = Joi.object({
  producto_id: Joi.number().integer().required(),
  finca_id: Joi.number().integer().required(),
  stock_actual: Joi.number().required(),
  stock_minimo: Joi.number().allow(null),
  precio_compra: Joi.number().positive().allow(null),
  fecha_ultima_compra: Joi.alternatives().try(Joi.string().isoDate(), Joi.date().iso()).allow(null, '')
});

const router = Router({ mergeParams: true });

router.get('/', inventarioController.obtenerTodos);
router.get('/alertas', inventarioController.alertas);
router.get('/:id', inventarioController.obtenerPorId);
router.post('/', validate(inventarioSchema), inventarioController.crear);
router.put('/:id', validate(inventarioSchema), inventarioController.actualizar);
router.delete('/:id', inventarioController.eliminar);

module.exports = router;