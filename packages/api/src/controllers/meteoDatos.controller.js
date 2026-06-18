const meteoService = require('../services/meteoDatos.service');
class MeteoDatosController {
  async crear(req, res, next) {
    try {
      if (req.body.fecha) req.body.fecha = new Date(req.body.fecha);
      const r = await meteoService.crear(Number(req.params.fincaId), req.body);
      res.status(201).json(r);
    } catch(e) { next(e); }
  }
  async obtenerTodos(req, res, next) {
    try {
      const r = await meteoService.obtenerTodos(Number(req.params.fincaId), req.query.desde, req.query.hasta);
      res.json(r);
    } catch(e) { next(e); }
  }
  async obtenerPorId(req, res, next) { try { const r = await meteoService.obtenerPorId(Number(req.params.id)); if(!r) return res.status(404).json({error:'No encontrado'}); res.json(r); } catch(e) { next(e); } }
  async actualizar(req, res, next) {
    try {
      if (req.body.fecha) req.body.fecha = new Date(req.body.fecha);
      const r = await meteoService.actualizar(Number(req.params.id), req.body);
      res.json(r);
    } catch(e) { next(e); }
  }
  async eliminar(req, res, next) { try { await meteoService.eliminar(Number(req.params.id)); res.status(204).send(); } catch(e) { next(e); } }
  async resumen(req, res, next) { try { const r = await meteoService.resumen(Number(req.params.fincaId)); res.json(r); } catch(e) { next(e); } }
}
module.exports = new MeteoDatosController();