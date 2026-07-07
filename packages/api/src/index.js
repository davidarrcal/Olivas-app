require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');
const convertDates = require('./middleware/convertDates');
const { verifyFincaOwnership, verifyBancalOwnership } = require('./middleware/verifyOwnership');

const authRoutes = require('./routes/auth.routes');
const fincaRoutes = require('./routes/finca.routes');
const bancalRoutes = require('./routes/bancal.routes');
const riegoRoutes = require('./routes/riego.routes');
const abonadoRoutes = require('./routes/abonado.routes');
const tratamientoRoutes = require('./routes/tratamiento.routes');
const productoRoutes = require('./routes/producto.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const podaRoutes = require('./routes/poda.routes');
const cosechaRoutes = require('./routes/cosecha.routes');
const meteoRoutes = require('./routes/meteoDatos.routes');
const analisisRoutes = require('./routes/analisis.routes');
const gastoRoutes = require('./routes/gasto.routes');
const ingresoRoutes = require('./routes/ingreso.routes');
const diarioRoutes = require('./routes/diarioCampo.routes');
const maquinariaRoutes = require('./routes/maquinaria.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const iaRoutes = require('./routes/ia.routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(convertDates);

app.get('/', (req, res) => { res.json({ app: 'Olivas API', version: '3.0.0' }); });
app.get('/api/health', (req, res) => { res.json({ estado: 'ok', timestamp: new Date().toISOString() }); });

app.use('/api/auth', authRoutes);

app.use('/api', authMiddleware);

app.use('/api/fincas', fincaRoutes);
app.use('/api/fincas/:fincaId/bancales', verifyFincaOwnership, bancalRoutes);
app.use('/api/fincas/:fincaId/bancales/:bancalId/riegos', verifyFincaOwnership, riegoRoutes);
app.use('/api/fincas/:fincaId/bancales/:bancalId/abonados', verifyFincaOwnership, abonadoRoutes);
app.use('/api/fincas/:fincaId/bancales/:bancalId/tratamientos', verifyFincaOwnership, tratamientoRoutes);
app.use('/api/fincas/:fincaId/bancales/:bancalId/podas', verifyFincaOwnership, podaRoutes);
app.use('/api/fincas/:fincaId/bancales/:bancalId/cosechas', verifyFincaOwnership, cosechaRoutes);
app.use('/api/fincas/:fincaId/bancales/:bancalId/analisis', verifyFincaOwnership, analisisRoutes);
app.use('/api/fincas/:fincaId/bancales/:bancalId/diario', verifyFincaOwnership, diarioRoutes);
app.use('/api/fincas/:fincaId/meteo', verifyFincaOwnership, meteoRoutes);
app.use('/api/fincas/:fincaId/gastos', verifyFincaOwnership, gastoRoutes);
app.use('/api/fincas/:fincaId/ingresos', verifyFincaOwnership, ingresoRoutes);
app.use('/api/fincas/:fincaId/maquinaria', verifyFincaOwnership, maquinariaRoutes);
app.use('/api/fincas/:fincaId/inventario', verifyFincaOwnership, inventarioRoutes);
app.use('/api/fincas/:fincaId/dashboard', verifyFincaOwnership, dashboardRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ia', iaRoutes);

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
app.get('/api/bancales/:id', async (req, res, next) => {
  try {
    const bancal = await prisma.bancal.findFirst({
      where: { id: Number(req.params.id), finca: { usuario_id: req.user.id } },
      include: { finca: true, variedades: true, riegos: { orderBy: { fecha_inicio: 'desc' }, take: 5 }, abonados: { orderBy: { fecha: 'desc' }, take: 5, include: { producto: true } }, tratamientos: { orderBy: { fecha: 'desc' }, take: 5, include: { producto: true } }, podas: { orderBy: { fecha: 'desc' }, take: 5 }, cosechas: { orderBy: { fecha: 'desc' }, take: 5 }, analisis: { orderBy: { fecha: 'desc' }, take: 5 } }
    });
    if (!bancal) return res.status(404).json({ error: 'Bancal no encontrado' });
    res.json(bancal);
  } catch (err) { next(err); }
});

app.use(errorHandler);
app.listen(PORT, () => { console.log('Olivas API v3 arrancada en http://localhost:' + PORT); });