const fincaService = require('../services/finca.service');

class FincaController {
  async crear(req, res, next) {
    try {
      const finca = await fincaService.crear(req.body);
      res.status(201).json(finca);
    } catch (err) { next(err); }
  }

  async obtenerTodas(req, res, next) {
    try {
      const fincas = await fincaService.obtenerTodas();
      res.json(fincas);
    } catch (err) { next(err); }
  }

  async obtenerPorId(req, res, next) {
    try {
      const finca = await fincaService.obtenerPorId(Number(req.params.id));
      if (!finca) return res.status(404).json({ error: 'Finca no encontrada' });
      res.json(finca);
    } catch (err) { next(err); }
  }

  async actualizar(req, res, next) {
    try {
      const finca = await fincaService.actualizar(Number(req.params.id), req.body);
      res.json(finca);
    } catch (err) { next(err); }
  }

  async eliminar(req, res, next) {
    try {
      await fincaService.eliminar(Number(req.params.id));
      res.status(204).send();
    } catch (err) { next(err); }
  }

  async resumen(req, res, next) {
    try {
      const resumen = await fincaService.resumen(Number(req.params.id));
      if (!resumen) return res.status(404).json({ error: 'Finca no encontrada' });
      res.json(resumen);
    } catch (err) { next(err); }
  }
}

module.exports = new FincaController();