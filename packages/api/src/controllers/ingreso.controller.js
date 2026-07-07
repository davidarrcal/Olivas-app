const ingresoService = require('../services/ingreso.service');
class IngresoController {
  async crear(req, res, next) { try { const r = await ingresoService.crear(req.body); res.status(201).json(r); } catch(e) { next(e); } }
  async obtenerTodos(req, res, next) { try { const r = await ingresoService.obtenerTodos(Number(req.params.fincaId), req.query.categoria); res.json(r); } catch(e) { next(e); } }
  async obtenerPorId(req, res, next) { try { const r = await ingresoService.obtenerPorId(Number(req.params.id), req.user.id); if(!r) return res.status(404).json({error:'No encontrado'}); res.json(r); } catch(e) { next(e); } }
  async actualizar(req, res, next) { try { const r = await ingresoService.actualizar(Number(req.params.id), req.body, req.user.id); res.json(r); } catch(e) { next(e); } }
  async eliminar(req, res, next) { try { await ingresoService.eliminar(Number(req.params.id), req.user.id); res.status(204).send(); } catch(e) { next(e); } }
  async resumen(req, res, next) { try { const r = await ingresoService.resumen(Number(req.params.fincaId)); res.json(r); } catch(e) { next(e); } }
}
module.exports = new IngresoController();