import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { getCultivo } from '../cultivos';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [fincas, setFincas] = useState([]);
  const [fincaId, setFincaId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarFincas() {
      try {
        const fincasData = await api.get('/fincas');
        setFincas(fincasData);
        if (fincasData.length > 0) {
          setFincaId(fincasData[0].id);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    cargarFincas();
  }, []);

  useEffect(() => { if (fincaId) cargarDashboard(); }, [fincaId]);

  async function cargarDashboard() {
    try {
      const d = await api.get('/fincas/' + fincaId + '/dashboard/resumen');
      setData(d);
    } catch (err) { console.error(err); }
  }

  if (loading) return <div className="empty-state"><h3>Cargando...</h3></div>;

  if (fincas.length === 0) {
    return (
      <div>
        <div className="page-header"><h2>Dashboard</h2></div>
        <div className="empty-state">
          <h3>Bienvenido a Gestion de Campo</h3>
          <p>Empieza creando tu primera finca para gestionar tu explotacion agricola.</p>
          <Link to="/fincas" className="btn btn-primary" style={{ marginTop: '1rem' }}>Crear Finca</Link>
        </div>
      </div>
    );
  }

  if (!data) return <div className="empty-state"><h3>Cargando datos...</h3></div>;

  const s = data.stats;
  const fincaActual = fincas.find(f => f.id === fincaId);
  const cultivo = getCultivo(fincaActual?.tipo_cultivo || 'olivo');
  const TIPOSEvento = { riego: { color: '#2980b9', icon: 'R' }, abonado: { color: '#27ae60', icon: 'A' }, tratamiento: { color: '#e67e22', icon: 'S' }, poda: { color: '#8e44ad', icon: 'P' }, cosecha: { color: '#c0392b', icon: 'C' } };

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard {cultivo.icono}</h2>
        <select value={fincaId} onChange={e => setFincaId(Number(e.target.value))} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--gris-claro)' }}>
          {fincas.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
        </select>
      </div>

      <div className="card-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="card"><h3>Bancales</h3><div className="stat">{s.num_bancales}</div><p>{s.superficie_total.toFixed(1)} ha | {s.total_arboles} arboles</p></div>
        <div className="card"><h3>Cosecha</h3><div className="stat">{s.kg_cosechados.toLocaleString('es-ES')} kg</div><p>Kg recolectados</p></div>
        <div className="card"><h3>Gastos</h3><div className="stat" style={{ color: '#c0392b' }}>{s.total_gastos.toLocaleString('es-ES')} EUR</div><p>Este mes: {s.gastos_mes.toLocaleString('es-ES')} EUR</p></div>
        <div className="card"><h3>Ingresos</h3><div className="stat" style={{ color: '#27ae60' }}>{s.total_ingresos.toLocaleString('es-ES')} EUR</div><p>Este mes: {s.ingresos_mes.toLocaleString('es-ES')} EUR</p></div>
        <div className="card"><h3>Resultado</h3><div className="stat" style={{ color: s.beneficio >= 0 ? '#27ae60' : '#c0392b' }}>{s.beneficio.toLocaleString('es-ES')} EUR</div><p>{s.beneficio >= 0 ? 'Beneficio' : 'Perdida'}</p></div>
        <div className="card"><h3>Vendido</h3><div className="stat">{s.kg_vendidos.toLocaleString('es-ES')} kg</div><p>Precio medio: {s.kg_vendidos > 0 ? ((s.total_ingresos / s.kg_vendidos) || 0).toFixed(2) + ' EUR/kg' : '-'}</p></div>
      </div>

      {data.alertas.periodos_seguridad.length > 0 && (
        <div className="alerta alerta-aviso" style={{ marginBottom: '1rem' }}>
          <strong>Periodos de seguridad activos:</strong>
          <ul style={{ marginTop: '0.5rem' }}>
            {data.alertas.periodos_seguridad.slice(0, 5).map((t, i) => (
              <li key={i}>{t.bancal?.nombre} - {t.plaga_enfermedad || 'Tratamiento'}: quedan <strong>{t.dias_restantes} dias</strong> (hasta {t.fecha_fin})</li>
            ))}
          </ul>
        </div>
      )}

      {data.alertas.stock_bajo.length > 0 && (
        <div className="alerta alerta-info" style={{ marginBottom: '1rem' }}>
          <strong>Stock bajo:</strong> {data.alertas.stock_bajo.map(a => a.producto + ' (' + a.stock + '/' + a.minimo + ')').join(', ')}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <h3 style={{ marginBottom: '0.75rem' }}>Bancales</h3>
          <div className="card-grid">
            {data.bancales.map(b => (
              <Link key={b.id} to={'/bancales/' + b.id} style={{ textDecoration: 'none' }}>
                <div className="card">
                  <h3>{b.nombre}</h3>
                  <p>{b.superficie || '-'} ha</p>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                    {b.variedades?.map((v, i) => <span key={i} className="badge badge-verde">{v.variedad}</span>)}
                  </div>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                    {b._count?.riegos > 0 && <span className="badge badge-azul">R:{b._count.riegos}</span>}
                    {b._count?.abonados > 0 && <span className="badge badge-verde">A:{b._count.abonados}</span>}
                    {b._count?.tratamientos > 0 && <span className="badge badge-naranja">S:{b._count.tratamientos}</span>}
                    {b._count?.cosechas > 0 && <span className="badge badge-rojo">C:{b._count.cosechas}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '0.75rem' }}>Actividad reciente</h3>
          {data.actividad_reciente.abonados.length === 0 && data.actividad_reciente.tratamientos.length === 0 && data.actividad_reciente.riegos.length === 0 ? (
            <div className="card"><p>No hay actividad reciente.</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.actividad_reciente.riegos.map((r, i) => (
                <div key={'r'+i} className="card" style={{ padding: '0.75rem', borderLeft: '4px solid #2980b9' }}>
                  <strong>Riego</strong> - {r.bancal?.nombre || 'Bancal'} | {new Date(r.fecha_inicio).toLocaleDateString('es-ES')} | {r.volumen_m3 ? r.volumen_m3 + ' m3' : '-'}
                </div>
              ))}
              {data.actividad_reciente.abonados.map((a, i) => (
                <div key={'a'+i} className="card" style={{ padding: '0.75rem', borderLeft: '4px solid #27ae60' }}>
                  <strong>Abonado</strong> - {a.bancal?.nombre || 'Bancal'} | {new Date(a.fecha).toLocaleDateString('es-ES')} | {a.producto?.nombre || a.tipo} {a.npk ? '(' + a.npk + ')' : ''}
                </div>
              ))}
              {data.actividad_reciente.tratamientos.map((t, i) => (
                <div key={'t'+i} className="card" style={{ padding: '0.75rem', borderLeft: '4px solid #e67e22' }}>
                  <strong>Tratamiento</strong> - {t.bancal?.nombre || 'Bancal'} | {new Date(t.fecha).toLocaleDateString('es-ES')} | {t.plaga_enfermedad || ''} {t.producto?.nombre ? '- ' + t.producto.nombre : ''}
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '1rem' }}>
            <Link to="/economia" className="btn btn-secondary" style={{ marginRight: '0.5rem' }}>Economia</Link>
            <Link to="/calendario" className="btn btn-secondary">Calendario</Link>
          </div>
        </div>
      </div>
    </div>
  );
}