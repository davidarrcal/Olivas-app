import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useConfirm } from '../hooks/useConfirm';
import { useToast } from '../hooks/useToast';
import { CULTIVO_LIST, getCultivo } from '../cultivos';

export default function Fincas() {
  const [fincas, setFincas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nombre: '', tipo_cultivo: 'olivo', ubicacion: '', altitud: '', superficie_total: '' });
  const [customCultivo, setCustomCultivo] = useState('');
  const [loading, setLoading] = useState(false);
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  useEffect(() => { cargarFincas(); }, []);

  async function cargarFincas() {
    try { const data = await api.get('/fincas'); setFincas(data); } catch (err) { showToast('Error al cargar fincas', 'error'); }
  }

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true);
    const tipoCultivo = form.tipo_cultivo === 'otro' && customCultivo ? customCultivo.toLowerCase().replace(/\s+/g, '_') : form.tipo_cultivo;
    try {
      if (editId) {
        await api.put('/fincas/' + editId, {
          nombre: form.nombre, tipo_cultivo: tipoCultivo,
          ubicacion: form.ubicacion || null,
          altitud: form.altitud ? Number(form.altitud) : null, superficie_total: form.superficie_total ? Number(form.superficie_total) : null
        });
        showToast('Finca actualizada correctamente');
      } else {
        await api.post('/fincas', {
          nombre: form.nombre, tipo_cultivo: tipoCultivo,
          ubicacion: form.ubicacion || null,
          altitud: form.altitud ? Number(form.altitud) : null, superficie_total: form.superficie_total ? Number(form.superficie_total) : null
        });
        showToast('Finca creada correctamente');
      }
      setShowModal(false); setEditId(null); setForm({ nombre: '', tipo_cultivo: 'olivo', ubicacion: '', altitud: '', superficie_total: '' }); setCustomCultivo('');
      cargarFincas();
    } catch (err) { showToast(err.message || 'Error al guardar finca', 'error'); }
    setLoading(false);
  }

  function abrirEditar(f) {
    setEditId(f.id);
    const cultivoKey = CULTIVO_LIST.some(c => c.key === f.tipo_cultivo) ? f.tipo_cultivo : 'otro';
    setForm({ nombre: f.nombre, tipo_cultivo: cultivoKey, ubicacion: f.ubicacion || '', altitud: f.altitud || '', superficie_total: f.superficie_total || '' });
    setCustomCultivo(cultivoKey === 'otro' ? f.tipo_cultivo : '');
    setShowModal(true);
  }

  function abrirCrear() {
    setEditId(null);
    setForm({ nombre: '', tipo_cultivo: 'olivo', ubicacion: '', altitud: '', superficie_total: '' });
    setCustomCultivo('');
    setShowModal(true);
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
      <div className="page-header">
        <h2>Fincas</h2>
        <button className="btn btn-primary" onClick={abrirCrear} disabled={loading}>+ Nueva Finca</button>
      </div>
      {fincas.length === 0 ? (
        <div className="empty-state"><h3>No hay fincas</h3><p>Crea tu primera finca para empezar.</p></div>
      ) : (
        <div className="card-grid">
          {fincas.map(f => {
            const cultivo = getCultivo(f.tipo_cultivo);
            return (
              <div key={f.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Link to={'/fincas/' + f.id} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{cultivo.icono}</span>
                      <h3>{f.nombre}</h3>
                    </div>
                    <p>{cultivo.labelLargo}</p>
                    <p>{f.ubicacion || 'Sin ubicacion'} | Altitud: {f.altitud || '-'} m | {f.superficie_total || '-'} ha</p>
                    <span className="badge badge-verde">{f._count?.bancales || 0} bancales</span>
                  </Link>
                  <div style={{ display: 'flex', gap: '0.3rem', marginLeft: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => abrirEditar(f)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminar(f.id, f.nombre)}>X</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setEditId(null); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editId ? 'Editar Finca' : 'Nueva Finca'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre *</label>
                <input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Ej: Cortijo Las Oliveras" />
              </div>
              <div className="form-group">
                <label>Tipo de cultivo *</label>
                <select required value={form.tipo_cultivo} onChange={e => { setForm({...form, tipo_cultivo: e.target.value}); setCustomCultivo(''); }}>
                  {CULTIVO_LIST.map(c => <option key={c.key} value={c.key}>{c.icono} {c.label}</option>)}
                </select>
              </div>
              {form.tipo_cultivo === 'otro' && (
                <div className="form-group">
                  <label>Especifica el cultivo *</label>
                  <input required value={customCultivo} onChange={e => setCustomCultivo(e.target.value)} placeholder="Ej: Nogal, Aguacate, Chirimoyo..." />
                </div>
              )}
              <div className="form-group"><label>Ubicacion</label><input value={form.ubicacion} onChange={e => setForm({...form, ubicacion: e.target.value})} placeholder="Ej: Jaen, Andalucia" /></div>
              <div className="form-row">
                <div className="form-group"><label>Altitud (m)</label><input type="number" value={form.altitud} onChange={e => setForm({...form, altitud: e.target.value})} /></div>
                <div className="form-group"><label>Superficie total (ha)</label><input type="number" step="0.1" value={form.superficie_total} onChange={e => setForm({...form, superficie_total: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setEditId(null); }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : editId ? 'Guardar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
