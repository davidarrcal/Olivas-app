import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const TIPOS = {
  riego: { color: '#2980b9', label: 'Riego' },
  abonado: { color: '#27ae60', label: 'Abonado' },
  tratamiento: { color: '#e67e22', label: 'Sanidad' },
  poda: { color: '#8e44ad', label: 'Poda' },
  cosecha: { color: '#c0392b', label: 'Cosecha' }
};

const RECOMENDACIONES = [
  { mes: 0, label: 'Enero', tareas: ['Reposo invernal','Revision maquinaria','Planificacion anual'] },
  { mes: 1, label: 'Febrero', tareas: ['Poda de formacion y fructificacion','Recoger lena','Prevencion heladas'] },
  { mes: 2, label: 'Marzo', tareas: ['Abonado de fondo (NPK)','Preparar terreno','Inicio tratamientos cobre'] },
  { mes: 3, label: 'Abril', tareas: ['Abonado nitrogenado','Control mosca del olivo','Tratamientos foliares boro'] },
  { mes: 4, label: 'Mayo', tareas: ['Cuajado del fruto','Fertirriego','Control repilo'] },
  { mes: 5, label: 'Junio', tareas: ['Riegos frecuentes','Tratamientos mosca','Abonado potasio'] },
  { mes: 6, label: 'Julio', tareas: ['Riego intensivo','Vigilar plaga mosca','Control adventicias'] },
  { mes: 7, label: 'Agosto', tareas: ['Riego','Vigilar mosca del olivo','Preparar cosecha'] },
  { mes: 8, label: 'Septiembre', tareas: ['Pre-cosecha variedades tempranas','Riego','Tratamientos pre-cosecha'] },
  { mes: 9, label: 'Octubre', tareas: ['Cosecha Arbequina y Hojiblanca','Abonado post-cosecha','Analisis suelo'] },
  { mes: 10, label: 'Noviembre', tareas: ['Cosecha Picual','Abonado organico','Analisis foliar'] },
  { mes: 11, label: 'Diciembre', tareas: ['Fin cosecha','Poda sanitaria','Planificacion proximo anio'] }
];

export default function Calendario() {
  const { id: fincaId } = useParams();
  const [data, setData] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());

  useEffect(() => { cargar(); }, [fincaId]);

  async function cargar() {
    try {
      const d = await api.get('/fincas/' + fincaId + '/dashboard/calendario');
      setData(d);
    } catch (err) { console.error(err); }
  }

  const eventosMes = data ? data.eventos.filter(e => {
    const d = new Date(e.fecha);
    return d.getMonth() === mesSeleccionado;
  }) : [];

  const recomendacion = RECOMENDACIONES.find(r => r.mes === mesSeleccionado);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Calendario Agricola</h2>
          <Link to={'/fincas/' + fincaId} className="btn btn-secondary btn-sm">&larr; Volver a finca</Link>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {MESES.map((m, i) => (
          <button key={i} className={'btn ' + (i === mesSeleccionado ? 'btn-primary' : 'btn-secondary')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => setMesSeleccionado(i)}>
            {m.substring(0, 3)}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <h3 style={{ marginBottom: '0.75rem' }}>Tareas recomendadas - {recomendacion?.label}</h3>
          <div className="card">
            <ul style={{ paddingLeft: '1.5rem' }}>
              {recomendacion?.tareas.map((t, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{t}</li>)}
            </ul>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h4>Leyenda</h4>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {Object.entries(TIPOS).map(([key, val]) => (
                <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '12px', height: '12px', background: val.color, borderRadius: '2px', display: 'inline-block' }}></span> {val.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '0.75rem' }}>Actividad registrada - {MESES[mesSeleccionado]}</h3>
          {eventosMes.length === 0 ? (
            <div className="card"><p>No hay actividad registrada este mes.</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {eventosMes.map((e, i) => (
                <div key={i} className="card" style={{ padding: '0.75rem', borderLeft: '4px solid ' + (TIPOS[e.tipo]?.color || '#999') }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ color: TIPOS[e.tipo]?.color }}>{TIPOS[e.tipo]?.label || e.tipo}</strong>
                      <span style={{ marginLeft: '0.5rem', color: 'var(--gris-medio)' }}>{e.bancal}</span>
                    </div>
                    <span style={{ color: 'var(--gris-medio)' }}>{new Date(e.fecha).toLocaleDateString('es-ES')}</span>
                  </div>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>{e.detalle}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}