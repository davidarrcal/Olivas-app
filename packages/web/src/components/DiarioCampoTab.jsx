import { useState, useEffect } from 'react';
import api from '../api';
import { useConfirm } from '../hooks/useConfirm';
import { useToast } from '../hooks/useToast';

const TIPOS_LABOR = ['Riego','Abonado','Tratamiento','Poda','Recoleccion','Limpieza','Revisión','Otro'];
const fechaHoy = () => new Date().toISOString().split('T')[0];
const formVacio = { fecha: fechaHoy(), horas: '', tipo_labor: '', descripcion: '' };

export default function DiarioCampoTab({ bancalId, fincaId }) {
  const [registros, setRegistros] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(formVacio);
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  useEffect(() => { cargar(); }, [bancalId]);

  async function cargar() {
    const data = await api.get('/fincas/' + fincaId + '/bancales/' + bancalId + '/diario');
    setRegistros(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post('/fincas/' + fincaId + '/bancales/' + bancalId + '/diario', {
        fecha: form.fecha,
        horas: form.horas ? Number(form.horas) : null,
        tipo_labor: form.tipo_labor || null,
        descripcion: form.descripcion || null
      });
      setShowForm(false); setForm(formVacio);
      showToast('Entrada del diario creada correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al crear entrada del diario', 'error');
    }
  }

  async function eliminar(id) {
    const ok = await confirm('Eliminar entrada', '¿Desea eliminar esta entrada del diario?');
    if (!ok) return;
    try {
      await api.del('/fincas/' + fincaId + '/bancales/' + bancalId + '/diario/' + id);
      showToast('Entrada del diario eliminada correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al eliminar entrada del diario', 'error');
    }
  }

  const totalHoras = registros.reduce((s, r) => s + (r.horas || 0), 0);

  return (
    <div>
      <div className="page-header">
        <h3>Diario de Campo</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Nueva entrada</button>
      </div>

      {registros.length > 0 && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3>Total horas registradas</h3>
          <div className="stat">{totalHoras.toFixed(1)}h</div>
        </div>
      )}

      {registros.length === 0 ? (
        <div className="empty-state"><p>No hay entradas en el diario.</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Fecha</th><th>Tipo de labor</th><th>Horas</th><th>Descripcion</th><th></th></tr></thead>
            <tbody>
              {registros.map(r => (
                <tr key={r.id}>
                  <td>{new Date(r.fecha).toLocaleDateString('es-ES')}</td>
                  <td>{r.tipo_labor ? <span className="badge badge-azul">{r.tipo_labor}</span> : '-'}</td>
                  <td>{r.horas ? r.horas + 'h' : '-'}</td>
                  <td>{r.descripcion || '-'}</td>
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
            <h3>Nueva entrada del diario</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Fecha *</label>
                  <input type="date" required value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
                </div>
                <div className="form-group"><label>Horas trabajadas</label>
                  <input type="number" step="0.5" value={form.horas} onChange={e => setForm({...form, horas: e.target.value})} placeholder="Ej: 3.5" />
                </div>
              </div>
              <div className="form-group"><label>Tipo de labor</label>
                <select value={form.tipo_labor} onChange={e => setForm({...form, tipo_labor: e.target.value})}>
                  <option value="">-- Seleccionar --</option>
                  {TIPOS_LABOR.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Descripcion</label>
                <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} rows={3} />
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