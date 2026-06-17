import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useConfirm } from '../hooks/useConfirm';
import { useToast } from '../hooks/useToast';

const fechaHoy = () => new Date().toISOString().split('T')[0];
const formVacio = { nombre: '', tipo: '', horas_actuales: '', observaciones: '' };
const formMantVacio = { fecha: fechaHoy(), tipo: '', descripcion: '', proximo_aviso_horas: '', coste: '' };

export default function Maquinaria() {
  const { id: fincaId } = useParams();
  const [maquinas, setMaquinas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showMantForm, setShowMantForm] = useState(null);
  const [form, setForm] = useState(formVacio);
  const [formMant, setFormMant] = useState(formMantVacio);
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  useEffect(() => { cargar(); }, [fincaId]);

  async function cargar() {
    const data = await api.get('/fincas/' + fincaId + '/maquinaria');
    setMaquinas(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post('/fincas/' + fincaId + '/maquinaria', {
        finca_id: Number(fincaId),
        nombre: form.nombre, tipo: form.tipo || null,
        horas_actuales: form.horas_actuales ? Number(form.horas_actuales) : null,
        observaciones: form.observaciones || null
      });
      setShowForm(false); setForm(formVacio);
      showToast('Maquinaria creada correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al crear maquinaria', 'error');
    }
  }

  async function eliminar(id) {
    const ok = await confirm('Eliminar maquinaria', '¿Desea eliminar esta maquinaria?');
    if (!ok) return;
    try {
      await api.del('/maquinaria/' + id);
      showToast('Maquinaria eliminada correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al eliminar maquinaria', 'error');
    }
  }

  async function handleSubmitMant(e) {
    e.preventDefault();
    try {
      await api.post('/fincas/' + fincaId + '/maquinaria/' + showMantForm + '/mantenimientos', {
        fecha: formMant.fecha, tipo: formMant.tipo,
        descripcion: formMant.descripcion || null,
        proximo_aviso_horas: formMant.proximo_aviso_horas ? Number(formMant.proximo_aviso_horas) : null,
        coste: formMant.coste ? Number(formMant.coste) : null
      });
      setShowMantForm(null); setFormMant(formMantVacio);
      showToast('Mantenimiento creado correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al crear mantenimiento', 'error');
    }
  }

  async function eliminarMant(maqId, mantId) {
    const ok = await confirm('Eliminar mantenimiento', '¿Desea eliminar este mantenimiento?');
    if (!ok) return;
    try {
      await api.del('/maquinaria/' + maqId + '/mantenimientos/' + mantId);
      showToast('Mantenimiento eliminado correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al eliminar mantenimiento', 'error');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Maquinaria</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Nueva maquinaria</button>
      </div>

      {maquinas.length === 0 ? (
        <div className="empty-state"><p>No hay maquinaria registrada.</p></div>
      ) : (
        <div className="card-grid">
          {maquinas.map(m => (
            <div key={m.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3>{m.nombre}</h3>
                  <p>{m.tipo || 'Sin tipo'} | Horas: {m.horas_actuales ?? '-'}</p>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => eliminar(m.id)}>X</button>
              </div>
              {m.mantenimientos?.length > 0 && (
                <div style={{ marginTop: '0.75rem' }}>
                  <strong>Mantenimientos:</strong>
                  {m.mantenimientos.map(mt => (
                    <div key={mt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0', borderBottom: '1px solid var(--gris-claro)' }}>
                      <span>{new Date(mt.fecha).toLocaleDateString('es-ES')} - {mt.tipo} {mt.coste ? '(' + mt.coste + ' EUR)' : ''}</span>
                      <button className="btn btn-danger btn-sm" onClick={() => eliminarMant(m.id, mt.id)} style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}>X</button>
                    </div>
                  ))}
                </div>
              )}
              <button className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }} onClick={() => { setFormMant(formMantVacio); setShowMantForm(m.id); }}>+ Mantenimiento</button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Nueva Maquinaria</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Nombre *</label><input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Ej: Tractor John Deere 5075" /></div>
              <div className="form-row">
                <div className="form-group"><label>Tipo</label><input value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} placeholder="Ej: tractor, vibrador..." /></div>
                <div className="form-group"><label>Horas actuales</label><input type="number" value={form.horas_actuales} onChange={e => setForm({...form, horas_actuales: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Observaciones</label><textarea value={form.observaciones} onChange={e => setForm({...form, observaciones: e.target.value})} rows={2} /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMantForm && (
        <div className="modal-overlay" onClick={() => setShowMantForm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Nuevo Mantenimiento</h3>
            <form onSubmit={handleSubmitMant}>
              <div className="form-row">
                <div className="form-group"><label>Fecha *</label><input type="date" required value={formMant.fecha} onChange={e => setFormMant({...formMant, fecha: e.target.value})} /></div>
                <div className="form-group"><label>Tipo *</label><input required value={formMant.tipo} onChange={e => setFormMant({...formMant, tipo: e.target.value})} placeholder="Ej: Cambio de aceite" /></div>
              </div>
              <div className="form-group"><label>Descripcion</label><textarea value={formMant.descripcion} onChange={e => setFormMant({...formMant, descripcion: e.target.value})} rows={2} /></div>
              <div className="form-row">
                <div className="form-group"><label>Proximo aviso (horas)</label><input type="number" value={formMant.proximo_aviso_horas} onChange={e => setFormMant({...formMant, proximo_aviso_horas: e.target.value})} /></div>
                <div className="form-group"><label>Coste (EUR)</label><input type="number" step="0.01" value={formMant.coste} onChange={e => setFormMant({...formMant, coste: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowMantForm(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}