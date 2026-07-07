const diarioService = require('../services/diarioCampo.service');
class DiarioCampoController {
  async crear(req, res, next) { try { const r = await diarioService.crear(Number(req.params.bancalId), req.body); res.status(201).json(r); } catch(e) { next(e); } }
  async obtenerTodos(req, res, next) { try { const r = await diarioService.obtenerTodos(Number(req.params.bancalId)); res.json(r); } catch(e) { next(e); } }
  async obtenerPorId(req, res, next) { try { const r = await diarioService.obtenerPorId(Number(req.params.id), req.user.id); if(!r) return res.status(404).json({error:'No encontrado'}); res.json(r); } catch(e) { next(e); } }
  async actualizar(req, res, next) { try { const r = await diarioService.actualizar(Number(req.params.id), req.body, req.user.id); res.json(r); } catch(e) { next(e); } }
  async eliminar(req, res, next) { try { await diarioService.eliminar(Number(req.params.id), req.user.id); res.status(204).send(); } catch(e) { next(e); } }
}
module.exports = new DiarioCampoController();