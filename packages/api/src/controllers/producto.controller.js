const productoService = require('../services/producto.service');

class ProductoController {
  async crear(req, res, next) { try { const r = await productoService.crear(req.body); res.status(201).json(r); } catch(e) { next(e); } }
  async obtenerTodos(req, res, next) { try { const r = await productoService.obtenerTodos(req.query.tipo); res.json(r); } catch(e) { next(e); } }
  async obtenerPorId(req, res, next) { try { const r = await productoService.obtenerPorId(Number(req.params.id)); if(!r) return res.status(404).json({error:'No encontrado'}); res.json(r); } catch(e) { next(e); } }
  async actualizar(req, res, next) { try { const r = await productoService.actualizar(Number(req.params.id), req.body); res.json(r); } catch(e) { next(e); } }
  async eliminar(req, res, next) { try { await productoService.eliminar(Number(req.params.id)); res.status(204).send(); } catch(e) { next(e); } }
}
module.exports = new ProductoController();