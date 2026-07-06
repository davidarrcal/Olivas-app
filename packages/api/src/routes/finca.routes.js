const { Router } = require('express');
const fincaController = require('../controllers/finca.controller');
const validate = require('../middleware/validate');
const Joi = require('joi');

const fincaSchema = Joi.object({
  nombre: Joi.string().min(2).max(150).required(),
  tipo_cultivo: Joi.string().max(50).allow('', null),
  ubicacion: Joi.string().max(255).allow('', null),
  altitud: Joi.number().integer().allow(null),
  latitud: Joi.number().allow(null),
  longitud: Joi.number().allow(null),
  superficie_total: Joi.number().positive().allow(null)
});

const router = Router();

router.get('/', fincaController.obtenerTodas);
router.get('/:id/resumen', fincaController.resumen);
router.get('/:id', fincaController.obtenerPorId);
router.post('/', validate(fincaSchema), fincaController.crear);
router.put('/:id', validate(fincaSchema), fincaController.actualizar);
router.delete('/:id', fincaController.eliminar);

module.exports = router;