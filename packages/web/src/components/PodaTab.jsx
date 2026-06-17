import { useState, useEffect } from 'react';
import api from '../api';

const TIPOS_PODA = [
  { valor: 'formacion', etiqueta: 'Formacion' },
  { valor: 'fructificacion', etiqueta: 'Fructificacion' },
  { valor: 'renovacion', etiqueta: 'Renovacion' },
  { valor: 'sanitaria', etiqueta: 'Sanitaria' }
];

const fechaHoy = () => new Date().toISOString().split('T')[0];
const formVacio = { fecha: fechaHoy(), tipo: 'fructificacion', volumen_lena_kg: '', observaciones: '' };

export default function PodaTab({ bancalId, fincaId }) {
  const [podas, setPodas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(formVacio);

  useEffect(() => { cargar(); }, [bancalId]);

  async function cargar() {
    const data = await api.get('/fincas/' + fincaId + '/bancales/' + bancalId + '/podas');
    setPodas(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await api.post('/fincas/' + fincaId + '/bancales/' + bancalId + '/podas', {
      fecha: form.fecha,
      tipo: form.tipo,
      volumen_lena_kg: form.volumen_lena_kg ? Number(form.volumen_lena_kg) : null,
      observaciones: form.observaciones || null
    });
    setShowForm(false); setForm(formVacio); cargar();
  }

  async function eliminar(id) {
    if (!confirm('Eliminar esta poda?')) return;
    await api.del('/podas/' + id); cargar();
  }

  return (
    <div>
      <div className="page-header">
        <h3>Podas</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Nueva poda</button>
      </div>

      {podas.length === 0 ? (
        <div className="empty-state"><p>No hay podas registradas.</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Fecha</th><th>Tipo</th><th>Leña retirada (kg)</th><th>Observaciones</th><th></th></tr>
            </thead>
            <tbody>
              {podas.map(p => (
                <tr key={p.id}>
                  <td>{new Date(p.fecha).toLocaleDateString('es-ES')}</td>
                  <td><span className="badge badge-azul">{TIPOS_PODA.find(t => t.valor === p.tipo)?.etiqueta || p.tipo}</span></td>
                  <td>{p.volumen_lena_kg ?? '-'}</td>
                  <td>{p.observaciones || '-'}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => eliminar(p.id)}>X</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Nueva Poda</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha *</label>
                  <input type="date" required value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Tipo *</label>
                  <select required value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                    {TIPOS_PODA.map(t => <option key={t.valor} value={t.valor}>{t.etiqueta}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Volumen de leña retirada (kg)</label>
                <input type="number" value={form.volumen_lena_kg} onChange={e => setForm({...form, volumen_lena_kg: e.target.value})} />
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