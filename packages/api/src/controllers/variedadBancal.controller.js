const variedadService = require('../services/variedadBancal.service');

class VariedadBancalController {
  async crear(req, res, next) {
    try {
      const variedad = await variedadService.crear(Number(req.params.bancalId), req.body);
      res.status(201).json(variedad);
    } catch (err) { next(err); }
  }

  async obtenerTodos(req, res, next) {
    try {
      const variedades = await variedadService.obtenerTodos(Number(req.params.bancalId));
      res.json(variedades);
    } catch (err) { next(err); }
  }

  async obtenerPorId(req, res, next) {
    try {
      const variedad = await variedadService.obtenerPorId(Number(req.params.id));
      if (!variedad) return res.status(404).json({ error: 'Variedad no encontrada' });
      res.json(variedad);
    } catch (err) { next(err); }
  }

  async actualizar(req, res, next) {
    try {
      const variedad = await variedadService.actualizar(Number(req.params.id), req.body);
      res.json(variedad);
    } catch (err) { next(err); }
  }

  async eliminar(req, res, next) {
    try {
      await variedadService.eliminar(Number(req.params.id));
      res.status(204).send();
    } catch (err) { next(err); }
  }
}

module.exports = new VariedadBancalController();