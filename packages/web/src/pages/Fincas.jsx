import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useConfirm } from '../hooks/useConfirm';
import { useToast } from '../hooks/useToast';

const TEXTURAS = [
  { valor: 'arcilloso', etiqueta: 'Arcilloso' },
  { valor: 'franco_arcilloso', etiqueta: 'Franco-arcilloso' },
  { valor: 'franco', etiqueta: 'Franco' },
  { valor: 'franco_arenoso', etiqueta: 'Franco-arenoso' },
  { valor: 'arenoso', etiqueta: 'Arenoso' }
];

const formBancalVacio = { nombre: '', superficie: '', textura_suelo: '', pendiente: '', marco_plantacion: '', observaciones: '' };

export default function Fincas() {
  const [fincas, setFincas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', ubicacion: '', altitud: '', superficie_total: '' });
  const [loading, setLoading] = useState(false);
  const { confirm, ConfirmDialog } = useConfirm();
  const { showToast, Toast } = useToast();

  useEffect(() => { cargarFincas(); }, []);

  async function cargarFincas() {
    try { const data = await api.get('/fincas'); setFincas(data); } catch (err) { showToast('Error al cargar fincas', 'error'); }
  }

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true);
    try {
      await api.post('/fincas', {
        nombre: form.nombre, ubicacion: form.ubicacion || null,
        altitud: form.altitud ? Number(form.altitud) : null, superficie_total: form.superficie_total ? Number(form.superficie_total) : null
      });
      showToast('Finca creada correctamente');
      setShowModal(false); setForm({ nombre: '', ubicacion: '', altitud: '', superficie_total: '' });
      cargarFincas();
    } catch (err) { showToast(err.message || 'Error al crear finca', 'error'); }
    setLoading(false);
  }

  async function eliminar(id, nombre) {
    const ok = await confirm('Eliminar finca', 'Se borraran todos los bancales y datos asociados a "' + nombre + '". Esta accion no se puede deshacer.');
    if (!ok) return;
    try {
      await api.del('/fincas/' + id); showToast('Finca eliminada'); cargarFincas();
    } catch (err) { showToast(err.message || 'Error al eliminar', 'error'); }
  }

  return (
    <div>
      {Toast}
      {ConfirmDialog}
      <div className="page-header">
        <h2>Fincas</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)} disabled={loading}>+ Nueva Finca</button>
      </div>
      {fincas.length === 0 ? (
        <div className="empty-state"><h3>No hay fincas</h3><p>Crea tu primera finca para empezar.</p></div>
      ) : (
        <div className="card-grid">
          {fincas.map(f => (
            <div key={f.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Link to={'/fincas/' + f.id} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                  <h3>{f.nombre}</h3>
                  <p>{f.ubicacion || 'Sin ubicacion'}</p>
                  <p>Altitud: {f.altitud || '-'} m | {f.superficie_total || '-'} ha</p>
                  <span className="badge badge-verde">{f._count?.bancales || 0} bancales</span>
                </Link>
                <button className="btn btn-danger btn-sm" onClick={() => eliminar(f.id, f.nombre)} style={{ marginLeft: '0.5rem' }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Nueva Finca</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Nombre *</label><input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Ej: Cortijo Las Oliveras" /></div>
              <div className="form-group"><label>Ubicacion</label><input value={form.ubicacion} onChange={e => setForm({...form, ubicacion: e.target.value})} placeholder="Ej: Jaen, Andalucia" /></div>
              <div className="form-row">
                <div className="form-group"><label>Altitud (m)</label><input type="number" value={form.altitud} onChange={e => setForm({...form, altitud: e.target.value})} /></div>
                <div className="form-group"><label>Superficie total (ha)</label><input type="number" step="0.1" value={form.superficie_total} onChange={e => setForm({...form, superficie_total: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creando...' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}