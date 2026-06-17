import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const fechaHoy = () => new Date().toISOString().split('T')[0];
const formVacio = { fecha: fechaHoy(), temp_max: '', temp_min: '', lluvia_mm: '', humedad_pct: '', observaciones: '' };

export default function Meteo() {
  const { id: fincaId } = useParams();
  const [datos, setDatos] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(formVacio);

  useEffect(() => { cargar(); }, [fincaId]);

  async function cargar() {
    const [datosData, resumenData] = await Promise.all([
      api.get('/fincas/' + fincaId + '/meteo'),
      api.get('/fincas/' + fincaId + '/meteo/resumen').catch(() => null)
    ]);
    setDatos(datosData);
    if (resumenData) setResumen(resumenData);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await api.post('/fincas/' + fincaId + '/meteo', {
      fecha: form.fecha,
      temp_max: form.temp_max ? Number(form.temp_max) : null,
      temp_min: form.temp_min ? Number(form.temp_min) : null,
      lluvia_mm: form.lluvia_mm ? Number(form.lluvia_mm) : null,
      humedad_pct: form.humedad_pct ? Number(form.humedad_pct) : null,
      fuente: 'manual',
      observaciones: form.observaciones || null
    });
    setShowForm(false); setForm(formVacio); cargar();
  }

  async function eliminar(id) {
    if (!confirm('Eliminar este registro meteo?')) return;
    await api.del('/meteo/' + id); cargar();
  }

  function esDiaLluvioso(d) { return d.lluvia_mm > 0; }
  function esHelada(d) { return d.temp_min !== null && d.temp_min < 0; }

  return (
    <div>
      <div className="page-header">
        <h2>Meteorologia</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Nuevo registro</button>
      </div>

      {resumen && (
        <div className="card-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="card"><h3>Lluvia este mes</h3><div className="stat">{(resumen.lluvia_mes || 0).toFixed(1)} mm</div></div>
          <div className="card"><h3>Lluvia este anio</h3><div className="stat">{(resumen.lluvia_anio || 0).toFixed(1)} mm</div></div>
          <div className="card"><h3>Temp. max mes</h3><div className="stat">{resumen.temp_max_mes !== null ? resumen.temp_max_mes.toFixed(1) + ' C' : '-'}</div></div>
          <div className="card"><h3>Temp. min mes</h3><div className="stat">{resumen.temp_min_mes !== null ? resumen.temp_min_mes.toFixed(1) + ' C' : '-'}</div></div>
        </div>
      )}

      {datos.filter(esDiaLluvioso).length > 0 && (
        <div className="alerta alerta-info" style={{ marginBottom: '1rem' }}>
          <strong>Dias con lluvia:</strong> {datos.filter(esDiaLluvioso).length} registros con precipitacion en los datos mostrados.
        </div>
      )}

      {datos.filter(esHelada).length > 0 && (
        <div className="alerta alerta-aviso" style={{ marginBottom: '1rem' }}>
          <strong>Alerta de helada:</strong> {datos.filter(esHelada).length} registros con temperaturas bajo cero.
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Fecha</th><th>T. Max (C)</th><th>T. Min (C)</th><th>Lluvia (mm)</th><th>Humedad (%)</th><th>Fuente</th><th></th></tr>
          </thead>
          <tbody>
            {datos.map(d => (
              <tr key={d.id} style={esDiaLluvioso(d) ? { background: '#e8f4e8' } : esHelada(d) ? { background: '#fde8e8' } : {}}>
                <td>{new Date(d.fecha).toLocaleDateString('es-ES')}</td>
                <td>{d.temp_max ?? '-'}</td>
                <td>{d.temp_min ?? '-'}{d.temp_min !== null && d.temp_min < 0 ? ' !!' : ''}</td>
                <td>{d.lluvia_mm ?? '-'}{d.lluvia_mm > 0 ? ' &' : ''}</td>
                <td>{d.humedad_pct ?? '-'}</td>
                <td><span className="badge badge-azul">{d.fuente}</span></td>
                <td><button className="btn btn-danger btn-sm" onClick={() => eliminar(d.id)}>X</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {datos.length === 0 && <div className="empty-state"><p>No hay datos meteorologicos.</p></div>}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Nuevo Registro Meteorologico</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Fecha *</label>
                <input type="date" required value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group"><label>Temp. maxima (C)</label><input type="number" step="0.1" value={form.temp_max} onChange={e => setForm({...form, temp_max: e.target.value})} /></div>
                <div className="form-group"><label>Temp. minima (C)</label><input type="number" step="0.1" value={form.temp_min} onChange={e => setForm({...form, temp_min: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Lluvia (mm)</label><input type="number" step="0.1" value={form.lluvia_mm} onChange={e => setForm({...form, lluvia_mm: e.target.value})} /></div>
                <div className="form-group"><label>Humedad (%)</label><input type="number" step="0.1" value={form.humedad_pct} onChange={e => setForm({...form, humedad_pct: e.target.value})} /></div>
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