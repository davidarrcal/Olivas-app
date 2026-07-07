const maquinariaService = require('../services/maquinaria.service');
const mantenimientoService = require('../services/mantenimiento.service');
class MaquinariaController {
  async crear(req, res, next) { try { const r = await maquinariaService.crear(req.body); res.status(201).json(r); } catch(e) { next(e); } }
  async obtenerTodos(req, res, next) { try { const r = await maquinariaService.obtenerTodos(Number(req.params.fincaId)); res.json(r); } catch(e) { next(e); } }
  async obtenerPorId(req, res, next) { try { const r = await maquinariaService.obtenerPorId(Number(req.params.id), req.user.id); if(!r) return res.status(404).json({error:'No encontrada'}); res.json(r); } catch(e) { next(e); } }
  async actualizar(req, res, next) { try { const r = await maquinariaService.actualizar(Number(req.params.id), req.body, req.user.id); res.json(r); } catch(e) { next(e); } }
  async eliminar(req, res, next) { try { await maquinariaService.eliminar(Number(req.params.id), req.user.id); res.status(204).send(); } catch(e) { next(e); } }
  async crearMantenimiento(req, res, next) { try { const r = await mantenimientoService.crear({ ...req.body, maquinaria_id: Number(req.params.id) }); res.status(201).json(r); } catch(e) { next(e); } }
  async eliminarMantenimiento(req, res, next) { try { await mantenimientoService.eliminar(Number(req.params.mantId)); res.status(204).send(); } catch(e) { next(e); } }
}
module.exports = new MaquinariaController();