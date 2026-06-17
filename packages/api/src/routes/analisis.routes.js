const { Router } = require('express');
const analisisController = require('../controllers/analisis.controller');
const validate = require('../middleware/validate');
const Joi = require('joi');

const analisisSchema = Joi.object({
  tipo: Joi.string().valid('suelo', 'foliar', 'agua').required(),
  fecha: Joi.string().isoDate().required(),
  ph: Joi.number().allow(null),
  materia_organica: Joi.number().allow(null),
  nitrogeno: Joi.number().allow(null),
  fosforo: Joi.number().allow(null),
  potasio: Joi.number().allow(null),
  boro: Joi.number().allow(null),
  zinc: Joi.number().allow(null),
  hierro: Joi.number().allow(null),
  resultados_detallados: Joi.string().allow(null, ''),
  laboratorio: Joi.string().max(200).allow(null, ''),
  recomendaciones: Joi.string().allow(null, ''),
  observaciones: Joi.string().allow(null, '')
});

const router = Router({ mergeParams: true });

router.get('/', analisisController.obtenerTodos);
router.get('/:id', analisisController.obtenerPorId);
router.post('/', validate(analisisSchema), analisisController.crear);
router.put('/:id', validate(analisisSchema), analisisController.actualizar);
router.delete('/:id', analisisController.eliminar);

module.exports = router;