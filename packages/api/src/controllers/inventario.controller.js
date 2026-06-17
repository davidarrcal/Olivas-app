const inventarioService = require('../services/inventario.service');

class InventarioController {
  async crear(req, res, next) { try { const r = await inventarioService.crear(req.body); res.status(201).json(r); } catch(e) { next(e); } }
  async obtenerTodos(req, res, next) { try { const r = await inventarioService.obtenerTodos(Number(req.params.fincaId)); res.json(r); } catch(e) { next(e); } }
  async obtenerPorId(req, res, next) { try { const r = await inventarioService.obtenerPorId(Number(req.params.id)); if(!r) return res.status(404).json({error:'No encontrado'}); res.json(r); } catch(e) { next(e); } }
  async actualizar(req, res, next) { try { const r = await inventarioService.actualizar(Number(req.params.id), req.body); res.json(r); } catch(e) { next(e); } }
  async eliminar(req, res, next) { try { await inventarioService.eliminar(Number(req.params.id)); res.status(204).send(); } catch(e) { next(e); } }
  async alertas(req, res, next) { try { const r = await inventarioService.alertas(Number(req.params.fincaId)); res.json(r); } catch(e) { next(e); } }
}
module.exports = new InventarioController();