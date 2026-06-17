const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);

  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'Ya existe un registro con esos datos únicos',
        detalle: err.meta?.target
      });
    }
    if (err.code === 'P2025' || err.code === 'P2018') {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    if (err.code === 'P2003') {
      return res.status(400).json({ error: 'Referencia inválida: el registro relacionado no existe' });
    }
  }

  if (err.name === 'PrismaClientValidationError') {
    return res.status(400).json({ error: 'Datos inválidos', detalle: err.message });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Error interno del servidor'
  });
};

module.exports = errorHandler;