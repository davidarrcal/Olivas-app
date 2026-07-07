const bancalService = require('../services/bancal.service');

class BancalController {
  async crear(req, res, next) {
    try {
      const data = { ...req.body, finca_id: Number(req.params.fincaId) };
      const bancal = await bancalService.crear(data, req.user.id);
      res.status(201).json(bancal);
    } catch (err) { next(err); }
  }

  async obtenerTodos(req, res, next) {
    try {
      const bancales = await bancalService.obtenerTodos(Number(req.params.fincaId));
      res.json(bancales);
    } catch (err) { next(err); }
  }

  async obtenerPorId(req, res, next) {
    try {
      const bancal = await bancalService.obtenerPorId(Number(req.params.id), req.user.id);
      if (!bancal) return res.status(404).json({ error: 'Bancal no encontrado' });
      res.json(bancal);
    } catch (err) { next(err); }
  }

  async actualizar(req, res, next) {
    try {
      const bancal = await bancalService.actualizar(Number(req.params.id), req.body, req.user.id);
      if (!bancal) return res.status(404).json({ error: 'Bancal no encontrado' });
      res.json(bancal);
    } catch (err) { next(err); }
  }

  async eliminar(req, res, next) {
    try {
      const result = await bancalService.eliminar(Number(req.params.id), req.user.id);
      if (!result) return res.status(404).json({ error: 'Bancal no encontrado' });
      res.status(204).send();
    } catch (err) { next(err); }
  }
}

module.exports = new BancalController();
