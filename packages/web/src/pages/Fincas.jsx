import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Fincas() {
  const [fincas, setFincas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', ubicacion: '', altitud: '', superficie_total: '' });

  useEffect(() => { cargarFincas(); }, []);

  async function cargarFincas() {
    try {
      const data = await api.get('/fincas');
      setFincas(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const body = {
      nombre: form.nombre,
      ubicacion: form.ubicacion || null,
      altitud: form.altitud ? Number(form.altitud) : null,
      superficie_total: form.superficie_total ? Number(form.superficie_total) : null
    };
    await api.post('/fincas', body);
    setShowModal(false);
    setForm({ nombre: '', ubicacion: '', altitud: '', superficie_total: '' });
    cargarFincas();
  }

  async function eliminar(id) {
    if (!confirm('Seguro que quieres eliminar esta finca? Se borraran todos sus bancales y datos asociados.')) return;
    await api.del(`/fincas/${id}`);
    cargarFincas();
  }

  return (
    <div>
      <div className="page-header">
        <h2>Fincas</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Nueva Finca
        </button>
      </div>

      {fincas.length === 0 ? (
        <div className="empty-state">
          <h3>No hay fincas</h3>
          <p>Crea tu primera finca para empezar a gestionar tu olivar.</p>
        </div>
      ) : (
        <div className="card-grid">
          {fincas.map(f => (
            <div key={f.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <Link to={`/fincas/${f.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3>{f.nombre}</h3>
                  </Link>
                  <p>{f.ubicacion || 'Sin ubicacion'}</p>
                  <p>Altitud: {f.altitud || '-'} m | Superficie: {f.superficie_total || '-'} ha</p>
                  <span className="badge badge-verde">{f._count?.bancales || 0} bancales</span>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => eliminar(f.id)}>X</button>
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
              <div className="form-group">
                <label>Nombre *</label>
                <input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Ubicación</label>
                <input value={form.ubicacion} onChange={e => setForm({ ...form, ubicacion: e.target.value })} placeholder="Ej: Jaen, Andalucia" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Altitud (m)</label>
                  <input type="number" value={form.altitud} onChange={e => setForm({ ...form, altitud: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Superficie total (ha)</label>
                  <input type="number" step="0.1" value={form.superficie_total} onChange={e => setForm({ ...form, superficie_total: e.target.value })} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}