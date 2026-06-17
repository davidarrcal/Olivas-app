const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errores = error.details.map(d => d.message);
    return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
  }
  next();
};

module.exports = validate;