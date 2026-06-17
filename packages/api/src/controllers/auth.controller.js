const authService = require('../services/auth.service');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    if (err.message === 'Credenciales incorrectas') return res.status(401).json({ error: err.message });
    next(err);
  }
}

async function register(req, res, next) {
  try {
    const { email, password, nombre } = req.body;
    if (!email || !password || !nombre) return res.status(400).json({ error: 'Email, contraseña y nombre son obligatorios' });
    if (password.length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    const result = await authService.register(email, password, nombre);
    res.status(201).json(result);
  } catch (err) {
    if (err.message === 'El email ya esta registrado') return res.status(409).json({ error: err.message });
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const result = await authService.me(req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Contraseña actual y nueva son obligatorias' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
    const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
    res.json(result);
  } catch (err) {
    if (err.message === 'Contraseña actual incorrecta') return res.status(400).json({ error: err.message });
    next(err);
  }
}

module.exports = { login, register, me, changePassword };