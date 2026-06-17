const { Router } = require('express');
const abonadoController = require('../controllers/abonado.controller');
const validate = require('../middleware/validate');
const Joi = require('joi');

const abonadoSchema = Joi.object({
  producto_id: Joi.number().integer().allow(null),
  fecha: Joi.string().isoDate().required(),
  tipo: Joi.string().valid('suelo', 'foliar', 'fertirriego', 'organico').required(),
  npk: Joi.string().max(50).allow(null, ''),
  dosis: Joi.number().positive().allow(null),
  dosis_unidad: Joi.string().max(20).allow(null, ''),
  estado_fenologico: Joi.string().max(50).allow(null, ''),
  observaciones: Joi.string().allow(null, '')
});

const router = Router({ mergeParams: true });

router.get('/', abonadoController.obtenerTodos);
router.get('/:id', abonadoController.obtenerPorId);
router.post('/', validate(abonadoSchema), abonadoController.crear);
router.put('/:id', validate(abonadoSchema), abonadoController.actualizar);
router.delete('/:id', abonadoController.eliminar);

module.exports = router;