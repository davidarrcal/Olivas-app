import { useState, useEffect } from 'react';
import api from '../api';
import { useConfirm } from '../hooks/useConfirm';
import { useToast } from '../hooks/useToast';

const fechaHoy = () => new Date().toISOString().split('T')[0];
const formVacio = { fecha: fechaHoy(), temp_max: '', temp_min: '', lluvia_mm: '', humedad_pct: '', observaciones: '' };

const ICONOS_CLIMA = {
  'Despejado': '\u2600\uFE0F', 'Despejado noche': '\uD83C\uDF19', 'Poco nuboso': '\uD83C\uDF24\uFE0F',
  'Intervalos nubosos': '\u26C5', 'Nuboso': '\uD83C\uDF2B\uFE0F', 'Muy nuboso': '\uD83C\uDF2B\uFE0F',
  'Cubierto': '\uD83C\uDF2B\uFE0F', 'Lluvia': '\uD83C\uDF27\uFE0F', 'Lluvia moderada': '\uD83C\uDF27\uFE0F',
  'Lluvia fuerte': '\uD83C\uDF27\uFE0F', 'Tormenta': '\u26C8\uFE0F', 'Nieve': '\uD83C\uDF28\uFE0F',
};

function iconoClima(estado) {
  if (!estado) return '\uD83C\uDF24\uFE0F';
  for (const [key, icon] of Object.entries(ICONOS_CLIMA)) {
    if (estado.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return '\uD83C\uDF24\uFE0F';
}

export default function Meteo() {
  const [fincaId, setFincaId] = useState(null);
  useEffect(() => {
    api.get('/fincas').then(fincas => {
      if (fincas.length > 0) setFincaId(fincas[0].id);
    });
  }, []);
  const [datos, setDatos] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [prediccion, setPrediccion] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(formVacio);
  const [loadingAemet, setLoadingAemet] = useState(false);
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  useEffect(() => { if (fincaId) cargar(); }, [fincaId]);

  async function cargar() {
    const [datosData, resumenData] = await Promise.all([
      api.get('/fincas/' + fincaId + '/meteo'),
      api.get('/fincas/' + fincaId + '/meteo/resumen').catch(() => null)
    ]);
    setDatos(datosData);
    if (resumenData) setResumen(resumenData);
    cargarPrediccion();
  }

  async function cargarPrediccion() {
    try {
      const data = await api.get('/fincas/' + fincaId + '/meteo/aemet');
      setPrediccion(data);
    } catch { setPrediccion([]); }
  }

  async function importarAemet() {
    setLoadingAemet(true);
    try {
      await api.post('/fincas/' + fincaId + '/meteo/importar-aemet');
      showToast('Datos de AEMET importados correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al importar datos de AEMET', 'error');
    }
    setLoadingAemet(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post('/fincas/' + fincaId + '/meteo', {
        fecha: form.fecha,
        temp_max: form.temp_max ? Number(form.temp_max) : null,
        temp_min: form.temp_min ? Number(form.temp_min) : null,
        lluvia_mm: form.lluvia_mm ? Number(form.lluvia_mm) : null,
        humedad_pct: form.humedad_pct ? Number(form.humedad_pct) : null,
        fuente: 'manual',
        observaciones: form.observaciones || null
      });
      setShowForm(false); setForm(formVacio);
      showToast('Registro meteorologico creado correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al crear registro meteorologico', 'error');
    }
  }

  async function eliminar(id) {
    const ok = await confirm('Eliminar registro', 'Desea eliminar este registro meteorologico?');
    if (!ok) return;
    try {
      await api.del('/fincas/' + fincaId + '/meteo/' + id);
      showToast('Registro meteorologico eliminado correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al eliminar registro meteorologico', 'error');
    }
  }

  function esDiaLluvioso(d) { return d.lluvia_mm > 0; }
  function esHelada(d) { return d.temp_min !== null && d.temp_min < 0; }

  if (!fincaId) return <div className="empty-state"><p>Cargando...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h2>Meteorologia</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Registro manual</button>
          <button className="btn btn-secondary" onClick={importarAemet} disabled={loadingAemet}>
            {loadingAemet ? 'Importando...' : 'Importar AEMET'}
          </button>
        </div>
      </div>

      {prediccion.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--verde-oscuro)', marginBottom: '0.75rem' }}>Pronostico AEMET - Zujar (Granada)</h3>
          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
            {prediccion.slice(0, 7).map((dia, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--gris-medio)', marginBottom: '0.3rem' }}>
                  {dia.fecha ? new Date(dia.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }) : '-'}
                </div>
                <div style={{ fontSize: '1.8rem' }}>{iconoClima(dia.estado_cielo)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gris-medio)', marginBottom: '0.3rem' }}>
                  {dia.estado_cielo || '-'}
                </div>
                <div style={{ fontWeight: '600' }}>
                  <span style={{ color: '#c0392b' }}>{dia.temp_max ?? '-'}\u00B0</span>
                  {' / '}
                  <span style={{ color: '#2980b9' }}>{dia.temp_min ?? '-'}\u00B0</span>
                </div>
                {dia.lluvia_mm !== null && dia.lluvia_mm > 0 && (
                  <div style={{ color: '#2980b9', fontSize: '0.8rem' }}>{dia.lluvia_mm} mm</div>
                )}
                {dia.prob_precipitacion !== null && (
                  <div style={{ color: 'var(--gris-medio)', fontSize: '0.75rem' }}>
                    Precip: {dia.prob_precipitacion}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
          <strong>Dias con lluvia:</strong> {datos.filter(esDiaLluvioso).length} registros con precipitacion.
        </div>
      )}

      {datos.filter(esHelada).length > 0 && (
        <div className="alerta alerta-aviso" style={{ marginBottom: '1rem' }}>
          <strong>Alerta de helada:</strong> {datos.filter(esHelada).length} registros con temperaturas bajo cero.
        </div>
      )}

      <h3 style={{ color: 'var(--verde-oscuro)', marginBottom: '0.75rem' }}>Registros</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr><th>Fecha</th><th>T. Max</th><th>T. Min</th><th>Lluvia</th><th>Humedad</th><th>Fuente</th><th></th></tr>
          </thead>
          <tbody>
            {datos.map(d => (
              <tr key={d.id} style={esDiaLluvioso(d) ? { background: '#e8f4e8' } : esHelada(d) ? { background: '#fde8e8' } : {}}>
                <td>{new Date(d.fecha).toLocaleDateString('es-ES')}</td>
                <td>{d.temp_max ?? '-'}\u00B0</td>
                <td>{d.temp_min ?? '-'}\u00B0{d.temp_min !== null && d.temp_min < 0 ? ' !!' : ''}</td>
                <td>{d.lluvia_mm ?? '-'}{d.lluvia_mm > 0 ? ' mm' : ''}</td>
                <td>{d.humedad_pct ?? '-'}{d.humedad_pct ? '%' : ''}</td>
                <td><span className={d.fuente === 'aemet' ? 'badge badge-azul' : 'badge badge-verde'}>{d.fuente === 'aemet' ? 'AEMET' : 'Manual'}</span></td>
                <td>{d.fuente !== 'aemet' && <button className="btn btn-danger btn-sm" onClick={() => eliminar(d.id)}>X</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {datos.length === 0 && <div className="empty-state"><p>No hay datos meteorologicos. Importa de AEMET o anade manualmente.</p></div>}

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