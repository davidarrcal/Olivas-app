import { useState, useEffect } from 'react';
import api from '../api';
import { useConfirm } from '../hooks/useConfirm';
import { useToast } from '../hooks/useToast';
import { getCultivo } from '../cultivos';

const fechaHoy = () => new Date().toISOString().split('T')[0];
const formVacio = { fecha: fechaHoy(), metodo_recoleccion: 'manual', kg_totales: '', rendimiento_graso_pct: '', almazara: '', observaciones: '' };

export default function CosechaTab({ bancalId, fincaId, tipoCultivo }) {
  const cultivo = getCultivo(tipoCultivo || 'olivo');
  const METODOS = cultivo.metodosRecoleccion;
  const [cosechas, setCosechas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...formVacio, metodo_recoleccion: METODOS[0]?.valor || 'manual' });
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  useEffect(() => { cargar(); }, [bancalId]);

  async function cargar() {
    const data = await api.get('/fincas/' + fincaId + '/bancales/' + bancalId + '/cosechas');
    setCosechas(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post('/fincas/' + fincaId + '/bancales/' + bancalId + '/cosechas', {
        fecha: form.fecha,
        metodo_recoleccion: form.metodo_recoleccion,
        kg_totales: Number(form.kg_totales),
        rendimiento_graso_pct: form.rendimiento_graso_pct ? Number(form.rendimiento_graso_pct) : null,
        almazara: form.almazara || null,
        observaciones: form.observaciones || null
      });
      setShowForm(false); setForm(formVacio);
      showToast('Cosecha creada correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al crear cosecha', 'error');
    }
  }

  async function eliminar(id) {
    const ok = await confirm('Eliminar cosecha', '¿Desea eliminar esta cosecha?');
    if (!ok) return;
    try {
      await api.del('/fincas/' + fincaId + '/bancales/' + bancalId + '/cosechas/' + id);
      showToast('Cosecha eliminada correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al eliminar cosecha', 'error');
    }
  }

  const totalKg = cosechas.reduce((sum, c) => sum + c.kg_totales, 0);
  const avgRendimiento = cosechas.length > 0 ? cosechas.reduce((sum, c) => sum + (c.rendimiento_graso_pct || 0), 0) / cosechas.filter(c => c.rendimiento_graso_pct).length : 0;

  return (
    <div>
      <div className="page-header">
        <h3>Cosecha</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Nueva cosecha</button>
      </div>

      {cosechas.length > 0 && (
        <div className="card-grid" style={{ marginBottom: '1rem' }}>
          <div className="card"><h3>Temporadas</h3><div className="stat">{cosechas.length}</div><p>Registros de cosecha</p></div>
          <div className="card"><h3>Total recolectado</h3><div className="stat">{totalKg.toLocaleString('es-ES')} kg</div><p>Acumulado</p></div>
          <div className="card"><h3>Rendimiento medio</h3><div className="stat">{avgRendimiento > 0 ? avgRendimiento.toFixed(1) + '%' : '-'}</div><p>Graso</p></div>
        </div>
      )}

      {cosechas.length === 0 ? (
        <div className="empty-state"><p>No hay cosechas registradas.</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Fecha</th><th>Metodo</th><th>Kg totales</th><th>Rendimiento (%)</th><th>Almazara</th><th></th></tr>
            </thead>
            <tbody>
              {cosechas.map(c => (
                <tr key={c.id}>
                  <td>{new Date(c.fecha).toLocaleDateString('es-ES')}</td>
                  <td><span className="badge badge-verde">{METODOS.find(m => m.valor === c.metodo_recoleccion)?.etiqueta || c.metodo_recoleccion}</span></td>
                  <td><strong>{c.kg_totales.toLocaleString('es-ES')} kg</strong></td>
                  <td>{c.rendimiento_graso_pct ? c.rendimiento_graso_pct + '%' : '-'}</td>
                  <td>{c.almazara || '-'}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => eliminar(c.id)}>X</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Nueva Cosecha</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha *</label>
                  <input type="date" required value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Metodo de recoleccion *</label>
                  <select required value={form.metodo_recoleccion} onChange={e => setForm({...form, metodo_recoleccion: e.target.value})}>
                    {METODOS.map(m => <option key={m.valor} value={m.valor}>{m.etiqueta}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Kg totales *</label>
                  <input type="number" step="0.1" required value={form.kg_totales} onChange={e => setForm({...form, kg_totales: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Rendimiento graso (%)</label>
                  <input type="number" step="0.1" value={form.rendimiento_graso_pct} onChange={e => setForm({...form, rendimiento_graso_pct: e.target.value})} placeholder="Ej: 21.5" />
                </div>
              </div>
              <div className="form-group">
                <label>Almazara</label>
                <input value={form.almazara} onChange={e => setForm({...form, almazara: e.target.value})} placeholder="Nombre de la almazara" />
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