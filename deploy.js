#!/bin/bash
# Script de despliegue para produccion
# USO: node deploy.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, 'packages', 'api', '.env');

console.log('=== DEPLOY OLIVAS APP ===\n');

// 1. Verificar .env
if (!fs.existsSync(envPath)) {
  console.log('ERROR: No existe packages/api/.env');
  console.log('Copia .env.example a .env y configura tu DATABASE_URL\n');
  console.log('  cp packages/api/.env.example packages/api/.env');
  console.log('  # Luego edita .env con tu URL de Supabase\n');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
if (envContent.includes('localhost')) {
  console.log('ADVERTENCIA: .env apunta a localhost (desarrollo local).');
  console.log('Para produccion, cambia DATABASE_URL a tu Supabase connection string.\n');
}

// 2. Generar Prisma Client
console.log('1. Generando Prisma Client...');
try {
  execSync('npx prisma generate', { cwd: path.join(__dirname, 'packages', 'api'), stdio: 'inherit' });
  console.log('   OK\n');
} catch (e) {
  console.log('   ERROR: Fallo prisma generate\n');
  process.exit(1);
}

// 3. Migrar base de datos
console.log('2. Aplicando migraciones...');
try {
  execSync('npx prisma migrate deploy', { cwd: path.join(__dirname, 'packages', 'api'), stdio: 'inherit' });
  console.log('   OK\n');
} catch (e) {
  console.log('   Intentando crear migracion...');
  try {
    execSync('npx prisma migrate dev --name init', { cwd: path.join(__dirname, 'packages', 'api'), stdio: 'inherit' });
    console.log('   OK\n');
  } catch (e2) {
    console.log('   ERROR: Fallo la migracion. Verifica tu DATABASE_URL\n');
    process.exit(1);
  }
}

// 4. Poblar datos si la DB esta vacia
console.log('3. Verificando datos...');
try {
  const result = execSync('node -e "const {PrismaClient}=require(\'@prisma/client\');const p=new PrismaClient();p.finca.count().then(c=>{console.log(c);p.\$disconnect()})"', {
    cwd: path.join(__dirname, 'packages', 'api'),
    encoding: 'utf8'
  });
  const count = parseInt(result.trim());
  if (count === 0) {
    console.log('   Base de datos vacia. Ejecutando seed...');
    execSync('node prisma/seed.js', { cwd: path.join(__dirname, 'packages', 'api'), stdio: 'inherit' });
    console.log('   Seed OK\n');
  } else {
    console.log('   Base de datos ya tiene ' + count + ' fincas. Omitiendo seed.\n');
  }
} catch (e) {
  console.log('   No se pudo verificar. Continuando...\n');
}

console.log('=== DESPLIEGUE COMPLETADO ===\n');
console.log('Para arrancar la API localmente:');
console.log('  cd packages/api && node src/index.js\n');
console.log('Para desplegar en RENDER:');
console.log('  1. Sube el proyecto a GitHub');
console.log('  2. Ve a render.com y crea un nuevo Web Service');
console.log('  3. Conecta tu repo de GitHub');
console.log('  4. Configura las variables de entorno (DATABASE_URL, NODE_ENV)');
console.log('  5. Deploy!\n');
console.log('Para desplegar en VERCEL (frontend):');
console.log('  1. Ve a vercel.com y crea un nuevo proyecto');
console.log('  2. Conecta tu repo de GitHub');
console.log('  3. Root directory: packages/web');
console.log('  4. Configura VITE_API_URL = https://tu-api.onrender.com');
console.log('  5. Deploy!');