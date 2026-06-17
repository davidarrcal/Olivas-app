const { Router } = require('express');
const dashboardController = require('../controllers/dashboard.controller');

const router = Router({ mergeParams: true });
router.get('/resumen', dashboardController.resumen);
router.get('/calendario', dashboardController.calendario);
module.exports = router;