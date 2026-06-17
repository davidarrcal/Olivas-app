import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

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
  const [form, setForm] = useState(formBancalVacio);

  useEffect(() => { cargar(); }, [id]);

  async function cargar() {
    const data = await api.get(`/fincas/${id}`);
    setFinca(data);
  }

  async function crearBancal(e) {
    e.preventDefault();
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
    cargar();
  }

  async function eliminarBancal(bancalId) {
    if (!confirm('Eliminar este bancal y todos sus datos asociados?')) return;
    await api.del(`/fincas/${id}/bancales/${bancalId}`);
    cargar();
  }

  if (!finca) return <div className="empty-state"><h3>Cargando...</h3></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>{finca.nombre}</h2>
          <p style={{ color: 'var(--gris-medio)' }}>{finca.ubicacion} | Altitud: {finca.altitud || '-'} m | {finca.superficie_total || '-'} ha</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nuevo Bancal</button>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Link to={'/fincas/' + id + '/meteo'} className="btn btn-secondary">Meteorologia</Link>
        <Link to={'/fincas/' + id + '/economia'} className="btn btn-secondary">Economia</Link>
        <Link to={'/fincas/' + id + '/maquinaria'} className="btn btn-secondary">Maquinaria</Link>
        <Link to={'/fincas/' + id + '/inventario'} className="btn btn-secondary">Inventario</Link>
        <Link to={'/fincas/' + id + '/calendario'} className="btn btn-secondary">Calendario</Link>
        <Link to={'/fincas/' + id + '/informes'} className="btn btn-secondary">Informes</Link>
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
                  <label>Marco de plantación</label>
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
    </div>
  );
}