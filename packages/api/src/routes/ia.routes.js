const { Router } = require('express');
const authMiddleware = require('../middleware/auth');
const iaService = require('../services/ia.service');
const iaAlertsService = require('../services/ia-alerts.service');
const prisma = require('../prisma');

const router = Router();

router.post('/chat', authMiddleware, async (req, res, next) => {
  try {
    await iaService.chat(req, res);
  } catch (err) {
    if (!res.headersSent) next(err);
  }
});

router.get('/alertas', authMiddleware, async (req, res, next) => {
  try {
    const alertas = await prisma.alertaIA.findMany({
      where: { usuario_id: req.user.id, leida: false },
      orderBy: { fecha_creacion: 'desc' },
      take: 20
    });
    res.json(alertas);
  } catch (err) { next(err); }
});

router.put('/alertas/:id/leida', authMiddleware, async (req, res, next) => {
  try {
    await prisma.alertaIA.update({
      where: { id: Number(req.params.id) },
      data: { leida: true }
    });
    res.status(204).send();
  } catch (err) { next(err); }
});

router.post('/alertas/generar', authMiddleware, async (req, res, next) => {
  try {
    const alertas = await iaAlertsService.generarAlertasProactivas(req.user.id);
    res.json({ generadas: alertas.length, alertas });
  } catch (err) { next(err); }
});

router.get('/conversaciones', authMiddleware, async (req, res, next) => {
  try {
    const convs = await prisma.conversacionIA.findMany({
      where: { usuario_id: req.user.id },
      orderBy: { fecha_actualizacion: 'desc' },
      take: 20,
      include: { _count: { select: { mensajes: true } } }
    });
    res.json(convs);
  } catch (err) { next(err); }
});

module.exports = router;
