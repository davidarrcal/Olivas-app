const DATE_FIELDS = [
  'fecha', 'fecha_inicio', 'fecha_fin', 'fecha_ultima_compra',
  'fecha_creacion', 'fecha_actualizacion'
];

module.exports = function convertDates(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    for (const key of DATE_FIELDS) {
      if (req.body[key] && typeof req.body[key] === 'string') {
        req.body[key] = new Date(req.body[key]);
      }
    }
  }
  next();
};