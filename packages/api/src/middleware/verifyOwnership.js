const prisma = require('../prisma');

async function verifyFincaOwnership(req, res, next) {
  const fincaId = Number(req.params.fincaId);
  const userId = req.user.id;

  if (!fincaId || isNaN(fincaId)) {
    return res.status(400).json({ error: 'ID de finca invalido' });
  }

  const finca = await prisma.finca.findFirst({
    where: { id: fincaId, usuario_id: userId },
    select: { id: true }
  });

  if (!finca) {
    return res.status(404).json({ error: 'Finca no encontrada' });
  }

  next();
}

async function verifyBancalOwnership(req, res, next) {
  const bancalId = Number(req.params.id) || Number(req.params.bancalId);
  const userId = req.user.id;

  if (!bancalId || isNaN(bancalId)) {
    return res.status(400).json({ error: 'ID de bancal invalido' });
  }

  const bancal = await prisma.bancal.findFirst({
    where: { id: bancalId, finca: { usuario_id: userId } },
    select: { id: true }
  });

  if (!bancal) {
    return res.status(404).json({ error: 'Bancal no encontrado' });
  }

  next();
}

module.exports = { verifyFincaOwnership, verifyBancalOwnership };
