import { useState, useEffect } from 'react';
import api from '../api';
import { useConfirm } from '../hooks/useConfirm';
import { useToast } from '../hooks/useToast';

const fechaHoy = () => new Date().toISOString().split('T')[0];

const formVacio = { fecha_inicio: fechaHoy() + 'T06:00', fecha_fin: '', volumen_m3: '', precipitacion_mm: '', etp: '', humedad_suelo_pct: '', observaciones: '' };

export default function RiegoTab({ bancalId, fincaId }) {
  const [riegos, setRiegos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(formVacio);
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  useEffect(() => { cargar(); }, [bancalId]);

  async function cargar() {
    const data = await api.get('/fincas/' + fincaId + '/bancales/' + bancalId + '/riegos');
    setRiegos(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const body = {
      fecha_inicio: form.fecha_inicio,
      fecha_fin: form.fecha_fin || null,
      volumen_m3: form.volumen_m3 ? Number(form.volumen_m3) : null,
      precipitacion_mm: form.precipitacion_mm ? Number(form.precipitacion_mm) : null,
      etp: form.etp ? Number(form.etp) : null,
      humedad_suelo_pct: form.humedad_suelo_pct ? Number(form.humedad_suelo_pct) : null,
      observaciones: form.observaciones || null
    };
    try {
      await api.post('/fincas/' + fincaId + '/bancales/' + bancalId + '/riegos', body);
      setShowForm(false);
      setForm(formVacio);
      showToast('Riego creado correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al crear riego', 'error');
    }
  }

  async function eliminar(id) {
    const ok = await confirm('Eliminar riego', '¿Desea eliminar este riego?');
    if (!ok) return;
    try {
      await api.del('/riegos/' + id);
      showToast('Riego eliminado correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al eliminar riego', 'error');
    }
  }

  function formatDate(iso) {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString('es-ES') + ' ' + new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  function calcDuration(start, end) {
    if (!start || !end) return '-';
    const ms = new Date(end) - new Date(start);
    const mins = Math.round(ms / 60000);
    if (mins < 60) return mins + ' min';
    return Math.floor(mins / 60) + 'h ' + (mins % 60) + 'min';
  }

  return (
    <div>
      <div className="page-header">
        <h3>Riegos</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Nuevo riego</button>
      </div>

      {riegos.length === 0 ? (
        <div className="empty-state"><p>No hay registros de riego.</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Fecha inicio</th><th>Duracion</th><th>Volumen (m3)</th><th>Precip. (mm)</th><th>ETP</th><th>Humedad (%)</th><th></th></tr>
            </thead>
            <tbody>
              {riegos.map(r => (
                <tr key={r.id}>
                  <td>{formatDate(r.fecha_inicio)}</td>
                  <td>{calcDuration(r.fecha_inicio, r.fecha_fin)}</td>
                  <td>{r.volumen_m3 ?? '-'}</td>
                  <td>{r.precipitacion_mm ?? '-'}</td>
                  <td>{r.etp ?? '-'}</td>
                  <td>{r.humedad_suelo_pct ?? '-'}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => eliminar(r.id)}>X</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Nuevo Riego</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha y hora inicio *</label>
                  <input type="datetime-local" required value={form.fecha_inicio} onChange={e => setForm({...form, fecha_inicio: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Fecha y hora fin</label>
                  <input type="datetime-local" value={form.fecha_fin} onChange={e => setForm({...form, fecha_fin: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Volumen (m3)</label>
                  <input type="number" step="0.1" value={form.volumen_m3} onChange={e => setForm({...form, volumen_m3: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Precipitacion (mm)</label>
                  <input type="number" step="0.1" value={form.precipitacion_mm} onChange={e => setForm({...form, precipitacion_mm: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ETP</label>
                  <input type="number" step="0.1" value={form.etp} onChange={e => setForm({...form, etp: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Humedad suelo (%)</label>
                  <input type="number" step="0.1" value={form.humedad_suelo_pct} onChange={e => setForm({...form, humedad_suelo_pct: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Observaciones</label>
                <textarea value={form.observaciones} onChange={e => setForm({...form, observaciones: e.target.value})} rows={2} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}