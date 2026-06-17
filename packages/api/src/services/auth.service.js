const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'olivas_app_jwt_secret_2026';
const JWT_EXPIRES_IN = '7d';

async function login(email, password) {
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) throw new Error('Credenciales incorrectas');

  const valid = await bcrypt.compare(password, usuario.password_hash);
  if (!valid) throw new Error('Credenciales incorrectas');

  const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return {
    token,
    usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre }
  };
}

async function register(email, password, nombre) {
  const exists = await prisma.usuario.findUnique({ where: { email } });
  if (exists) throw new Error('El email ya esta registrado');

  const password_hash = await bcrypt.hash(password, 10);
  const usuario = await prisma.usuario.create({
    data: { email, password_hash, nombre }
  });

  const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return {
    token,
    usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre }
  };
}

async function me(userId) {
  const usuario = await prisma.usuario.findUnique({ where: { id: userId } });
  if (!usuario) throw new Error('Usuario no encontrado');
  return { id: usuario.id, email: usuario.email, nombre: usuario.nombre };
}

async function changePassword(userId, currentPassword, newPassword) {
  const usuario = await prisma.usuario.findUnique({ where: { id: userId } });
  if (!usuario) throw new Error('Usuario no encontrado');

  const valid = await bcrypt.compare(currentPassword, usuario.password_hash);
  if (!valid) throw new Error('Contraseña actual incorrecta');

  const password_hash = await bcrypt.hash(newPassword, 10);
  await prisma.usuario.update({ where: { id: userId }, data: { password_hash } });
  return { ok: true };
}

module.exports = { login, register, me, changePassword };