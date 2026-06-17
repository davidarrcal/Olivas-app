const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'david@olivas.es';
  const password = process.env.ADMIN_PASSWORD || 'olivas123';
  const nombre = process.env.ADMIN_NOMBRE || 'David';

  const exists = await prisma.usuario.findUnique({ where: { email } });
  if (exists) {
    console.log('Usuario ya existe:', email);
    return;
  }

  const password_hash = await bcrypt.hash(password, 10);
  const usuario = await prisma.usuario.create({
    data: { email, password_hash, nombre }
  });
  console.log('Usuario creado:', { id: usuario.id, email: usuario.email, nombre: usuario.nombre });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());