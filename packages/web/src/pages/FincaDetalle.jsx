import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

export default function FincaDetalle() {
  const { id } = useParams();
  const [finca, setFinca] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditFinca, setShowEditFinca] = useState(false);
  const [form, setForm] = useState(formBancalVacio);
  const [formFinca, setFormFinca] = useState({ nombre: '', ubicacion: '', altitud: '', superficie_total: '' });
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  useEffect(() => { cargar(); }, [id]);

  async function cargar() {
    const data = await api.get(`/fincas/${id}`);
    setFinca(data);
  }

  async function editarFinca(e) {
    e.preventDefault();
    try {
      await api.put(`/fincas/${id}`, {
        nombre: formFinca.nombre,
        ubicacion: formFinca.ubicacion || null,
        altitud: formFinca.altitud ? Number(formFinca.altitud) : null,
        superficie_total: formFinca.superficie_total ? Number(formFinca.superficie_total) : null
      });
      setShowEditFinca(false);
      showToast('Finca actualizada correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al actualizar finca', 'error');
    }
  }

  async function crearBancal(e) {
    e.preventDefault();
    try {
      await api.post(`/fincas/${id}/bancales`, {
        finca_id: Number(id),
        nombre: form.nombre,
        superficie: form.superficie ? Number(form.superficie) : null,
        textura_suelo: form.textura_suelo || null,
        pendiente: form.pendiente ? Number(form.pendiente) : null,
        marco_plantacion: form.marco_plantacion || null,
        observaciones: form.observaciones || null
      });
      setShowModal(false);
      setForm(formBancalVacio);
      showToast('Bancal creado correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al crear bancal', 'error');
    }
  }

  async function eliminarBancal(bancalId) {
    const ok = await confirm('Eliminar bancal', 'Desea eliminar este bancal y todos sus datos asociados?');
    if (!ok) return;
    try {
      await api.del(`/fincas/${id}/bancales/${bancalId}`);
      showToast('Bancal eliminado correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al eliminar bancal', 'error');
    }
  }

  if (!finca) return <div className="empty-state"><h3>Cargando...</h3></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>{finca.nombre}</h2>
          <p style={{ color: 'var(--gris-medio)' }}>{finca.ubicacion} | Altitud: {finca.altitud || '-'} m | {finca.superficie_total || '-'} ha</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => { setFormFinca({ nombre: finca.nombre, ubicacion: finca.ubicacion || '', altitud: finca.altitud || '', superficie_total: finca.superficie_total || '' }); setShowEditFinca(true); }}>Editar finca</button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nuevo Bancal</button>
        </div>
      </div>

      {finca.bancales?.length === 0 ? (
        <div className="empty-state">
          <h3>No hay bancales</h3>
          <p>Anade bancales a esta finca.</p>
        </div>
      ) : (
        <div className="card-grid">
          {finca.bancales?.map(b => (
            <div key={b.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Link to={`/bancales/${b.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                  <h3>{b.nombre}</h3>
                  <p>Superficie: {b.superficie || '-'} ha | Pendiente: {b.pendiente || '-'}%</p>
                  <p>Suelo: {TEXTURAS.find(t => t.valor === b.textura_suelo)?.etiqueta || '-'} | Marco: {b.marco_plantacion || '-'}</p>
                  <div style={{ marginTop: '0.5rem' }}>
                    {b.variedades?.map((v, i) => (
                      <span key={i} className="badge badge-verde" style={{ marginRight: '0.3rem' }}>{v.variedad} ({v.num_arboles})</span>
                    ))}
                  </div>
                </Link>
                <button className="btn btn-danger btn-sm" onClick={() => eliminarBancal(b.id)}>X</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Nuevo Bancal</h3>
            <form onSubmit={crearBancal}>
              <div className="form-group">
                <label>Nombre *</label>
                <input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: La Loma" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Superficie (ha)</label>
                  <input type="number" step="0.1" value={form.superficie} onChange={e => setForm({ ...form, superficie: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Pendiente (%)</label>
                  <input type="number" step="0.1" value={form.pendiente} onChange={e => setForm({ ...form, pendiente: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Textura del suelo</label>
                  <select value={form.textura_suelo} onChange={e => setForm({ ...form, textura_suelo: e.target.value })}>
                    <option value="">-- Seleccionar --</option>
                    {TEXTURAS.map(t => <option key={t.valor} value={t.valor}>{t.etiqueta}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Marco de plantacion</label>
                  <input value={form.marco_plantacion} onChange={e => setForm({ ...form, marco_plantacion: e.target.value })} placeholder="Ej: 7x4" />
                </div>
              </div>
              <div className="form-group">
                <label>Observaciones</label>
                <textarea value={form.observaciones} onChange={e => setForm({ ...form, observaciones: e.target.value })} rows={2} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditFinca && (
        <div className="modal-overlay" onClick={() => setShowEditFinca(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Editar Finca</h3>
            <form onSubmit={editarFinca}>
              <div className="form-group"><label>Nombre *</label><input required value={formFinca.nombre} onChange={e => setFormFinca({...formFinca, nombre: e.target.value})} /></div>
              <div className="form-group"><label>Ubicacion</label><input value={formFinca.ubicacion} onChange={e => setFormFinca({...formFinca, ubicacion: e.target.value})} placeholder="Ej: Jaen, Andalucia" /></div>
              <div className="form-row">
                <div className="form-group"><label>Altitud (m)</label><input type="number" value={formFinca.altitud} onChange={e => setFormFinca({...formFinca, altitud: e.target.value})} /></div>
                <div className="form-group"><label>Superficie total (ha)</label><input type="number" step="0.1" value={formFinca.superficie_total} onChange={e => setFormFinca({...formFinca, superficie_total: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditFinca(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}