const dashboardService = require('../services/dashboard.service');

class DashboardController {
  async resumen(req, res, next) {
    try { const r = await dashboardService.resumenGlobal(Number(req.params.fincaId), req.user.id); if (!r) return res.status(404).json({error:'Finca no encontrada'}); res.json(r); } catch(e) { next(e); }
  }
  async calendario(req, res, next) {
    try { const r = await dashboardService.calendario(Number(req.params.fincaId), req.user.id); if (!r) return res.status(404).json({error:'Finca no encontrada'}); res.json(r); } catch(e) { next(e); }
  }
}
module.exports = new DashboardController();
