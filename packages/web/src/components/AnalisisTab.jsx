import { useState, useEffect } from 'react';
import api from '../api';
import { useConfirm } from '../hooks/useConfirm';
import { useToast } from '../hooks/useToast';

const TIPOS_ANALISIS = [
  { valor: 'suelo', etiqueta: 'Analisis de suelo' },
  { valor: 'foliar', etiqueta: 'Analisis foliar' },
  { valor: 'agua', etiqueta: 'Analisis de agua' }
];

const fechaHoy = () => new Date().toISOString().split('T')[0];
const formVacio = { tipo: 'suelo', fecha: fechaHoy(), ph: '', materia_organica: '', nitrogeno: '', fosforo: '', potasio: '', boro: '', zinc: '', hierro: '', laboratorio: '', recomendaciones: '', observaciones: '' };

export default function AnalisisTab({ bancalId, fincaId }) {
  const [analisis, setAnalisis] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(formVacio);
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  useEffect(() => { cargar(); }, [bancalId]);

  async function cargar() {
    const data = await api.get('/fincas/' + fincaId + '/bancales/' + bancalId + '/analisis');
    setAnalisis(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const body = {
      tipo: form.tipo,
      fecha: form.fecha,
      ph: form.ph ? Number(form.ph) : null,
      materia_organica: form.materia_organica ? Number(form.materia_organica) : null,
      nitrogeno: form.nitrogeno ? Number(form.nitrogeno) : null,
      fosforo: form.fosforo ? Number(form.fosforo) : null,
      potasio: form.potasio ? Number(form.potasio) : null,
      boro: form.boro ? Number(form.boro) : null,
      zinc: form.zinc ? Number(form.zinc) : null,
      hierro: form.hierro ? Number(form.hierro) : null,
      laboratorio: form.laboratorio || null,
      recomendaciones: form.recomendaciones || null,
      observaciones: form.observaciones || null
    };
    try {
      await api.post('/fincas/' + fincaId + '/bancales/' + bancalId + '/analisis', body);
      setShowForm(false); setForm(formVacio);
      showToast('Analisis creado correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al crear analisis', 'error');
    }
  }

  async function eliminar(id) {
    const ok = await confirm('Eliminar analisis', '¿Desea eliminar este analisis?');
    if (!ok) return;
    try {
      await api.del('/fincas/' + fincaId + '/bancales/' + bancalId + '/analisis/' + id);
      showToast('Analisis eliminado correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al eliminar analisis', 'error');
    }
  }

  function getUltimo(tipo) {
    return analisis.filter(a => a.tipo === tipo)[0];
  }

  return (
    <div>
      <div className="page-header">
        <h3>Analisis de Laboratorio</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Nuevo analisis</button>
      </div>

      {analisis.length === 0 ? (
        <div className="empty-state"><p>No hay analisis registrados.</p></div>
      ) : (
        <>
          {TIPOS_ANALISIS.map(tipo => {
            const ultimo = getUltimo(tipo.valor);
            if (!ultimo) return null;
            return (
              <div key={tipo.valor} className="card" style={{ marginBottom: '1rem' }}>
                <h3>{tipo.etiqueta} - {new Date(ultimo.fecha).toLocaleDateString('es-ES')}</h3>
                <p>Laboratorio: {ultimo.laboratorio || '-'}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {ultimo.ph !== null && <div><small>pH</small><br /><strong>{ultimo.ph}</strong></div>}
                  {ultimo.materia_organica !== null && <div><small>M.O.</small><br /><strong>{ultimo.materia_organica}%</strong></div>}
                  {ultimo.nitrogeno !== null && <div><small>N</small><br /><strong>{ultimo.nitrogeno}</strong></div>}
                  {ultimo.fosforo !== null && <div><small>P</small><br /><strong>{ultimo.fosforo}</strong></div>}
                  {ultimo.potasio !== null && <div><small>K</small><br /><strong>{ultimo.potasio}</strong></div>}
                  {ultimo.boro !== null && <div><small>B</small><br /><strong>{ultimo.boro}</strong></div>}
                  {ultimo.zinc !== null && <div><small>Zn</small><br /><strong>{ultimo.zinc}</strong></div>}
                  {ultimo.hierro !== null && <div><small>Fe</small><br /><strong>{ultimo.hierro}</strong></div>}
                </div>
                {ultimo.recomendaciones && <p style={{ marginTop: '0.5rem', color: 'var(--naranja)' }}><strong>Recomendaciones:</strong> {ultimo.recomendaciones}</p>}
              </div>
            );
          })}

          <div className="table-container">
            <table>
              <thead>
                <tr><th>Fecha</th><th>Tipo</th><th>pH</th><th>N</th><th>P</th><th>K</th><th>B</th><th>Laboratorio</th><th></th></tr>
              </thead>
              <tbody>
                {analisis.map(a => (
                  <tr key={a.id}>
                    <td>{new Date(a.fecha).toLocaleDateString('es-ES')}</td>
                    <td><span className="badge badge-azul">{TIPOS_ANALISIS.find(t => t.valor === a.tipo)?.etiqueta || a.tipo}</span></td>
                    <td>{a.ph ?? '-'}</td>
                    <td>{a.nitrogeno ?? '-'}</td>
                    <td>{a.fosforo ?? '-'}</td>
                    <td>{a.potasio ?? '-'}</td>
                    <td>{a.boro ?? '-'}</td>
                    <td>{a.laboratorio || '-'}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => eliminar(a.id)}>X</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Nuevo Analisis</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo *</label>
                  <select required value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                    {TIPOS_ANALISIS.map(t => <option key={t.valor} value={t.valor}>{t.etiqueta}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Fecha *</label>
                  <input type="date" required value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Laboratorio</label>
                <input value={form.laboratorio} onChange={e => setForm({...form, laboratorio: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group"><label>pH</label><input type="number" step="0.1" value={form.ph} onChange={e => setForm({...form, ph: e.target.value})} /></div>
                <div className="form-group"><label>Materia organica (%)</label><input type="number" step="0.1" value={form.materia_organica} onChange={e => setForm({...form, materia_organica: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Nitrogeno (N)</label><input type="number" step="0.1" value={form.nitrogeno} onChange={e => setForm({...form, nitrogeno: e.target.value})} /></div>
                <div className="form-group"><label>Fosforo (P)</label><input type="number" step="0.1" value={form.fosforo} onChange={e => setForm({...form, fosforo: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Potasio (K)</label><input type="number" step="0.1" value={form.potasio} onChange={e => setForm({...form, potasio: e.target.value})} /></div>
                <div className="form-group"><label>Boro (B)</label><input type="number" step="0.1" value={form.boro} onChange={e => setForm({...form, boro: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Zinc (Zn)</label><input type="number" step="0.1" value={form.zinc} onChange={e => setForm({...form, zinc: e.target.value})} /></div>
                <div className="form-group"><label>Hierro (Fe)</label><input type="number" step="0.1" value={form.hierro} onChange={e => setForm({...form, hierro: e.target.value})} /></div>
              </div>
              <div className="form-group">
                <label>Recomendaciones</label>
                <textarea value={form.recomendaciones} onChange={e => setForm({...form, recomendaciones: e.target.value})} rows={2} />
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