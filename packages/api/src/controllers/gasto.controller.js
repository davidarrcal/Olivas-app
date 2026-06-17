const gastoService = require('../services/gasto.service');
class GastoController {
  async crear(req, res, next) { try { const r = await gastoService.crear(req.body); res.status(201).json(r); } catch(e) { next(e); } }
  async obtenerTodos(req, res, next) { try { const r = await gastoService.obtenerTodos(Number(req.params.fincaId), req.query.categoria); res.json(r); } catch(e) { next(e); } }
  async obtenerPorId(req, res, next) { try { const r = await gastoService.obtenerPorId(Number(req.params.id)); if(!r) return res.status(404).json({error:'No encontrado'}); res.json(r); } catch(e) { next(e); } }
  async actualizar(req, res, next) { try { const r = await gastoService.actualizar(Number(req.params.id), req.body); res.json(r); } catch(e) { next(e); } }
  async eliminar(req, res, next) { try { await gastoService.eliminar(Number(req.params.id)); res.status(204).send(); } catch(e) { next(e); } }
  async resumen(req, res, next) { try { const r = await gastoService.resumen(Number(req.params.fincaId)); res.json(r); } catch(e) { next(e); } }
}
module.exports = new GastoController();