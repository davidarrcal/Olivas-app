import { useState, useEffect } from 'react';
import api from '../api';

export default function Informes() {
  const [fincaId, setFincaId] = useState(null);
  useEffect(() => {
    api.get('/fincas').then(fincas => {
      if (fincas.length > 0) setFincaId(fincas[0].id);
    });
  }, []);
  const [cosechas, setCosechas] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [riegos, setRiegos] = useState([]);

  useEffect(() => { if (fincaId) cargar(); }, [fincaId]);

  async function cargar() {
    const [c, g, i, r] = await Promise.all([
      (async () => {
        const bancales = await api.get('/fincas/' + fincaId + '/bancales');
        const allCosechas = [];
        for (const b of bancales) {
          try { const cs = await api.get('/fincas/' + fincaId + '/bancales/' + b.id + '/cosechas'); allCosechas.push(...cs); } catch(e) {}
        }
        return allCosechas;
      })(),
      api.get('/fincas/' + fincaId + '/gastos'),
      api.get('/fincas/' + fincaId + '/ingresos'),
      (async () => {
        const bancales = await api.get('/fincas/' + fincaId + '/bancales');
        const allRiegos = [];
        for (const b of bancales) {
          try { const rs = await api.get('/fincas/' + fincaId + '/bancales/' + b.id + '/riegos'); allRiegos.push(...rs); } catch(e) {}
        }
        return allRiegos;
      })()
    ]);
    setCosechas(flatten(c)); setGastos(g); setIngresos(i); setRiegos(flatten(r));
  }

  function flatten(arr) { return Array.isArray(arr) ? arr : []; }

  function groupByYear(arr, dateField) {
    const groups = {};
    arr.forEach(item => {
      const year = new Date(item[dateField]).getFullYear();
      if (!groups[year]) groups[year] = [];
      groups[year].push(item);
    });
    return groups;
  }

  const cosechasByYear = groupByYear(cosechas, 'fecha');
  const gastosByYear = groupByYear(gastos, 'fecha');
  const ingresosByYear = groupByYear(ingresos, 'fecha');
  const riegosByYear = groupByYear(riegos, 'fecha_inicio');

  const years = [...new Set([...Object.keys(cosechasByYear), ...Object.keys(gastosByYear), ...Object.keys(ingresosByYear), ...Object.keys(riegosByYear)])].sort().reverse();

  if (!fincaId) return <div className="empty-state"><p>Cargando...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h2>Informes Comparativos</h2>
      </div>

      {years.length === 0 ? (
        <div className="empty-state"><p>No hay datos suficientes para generar informes.</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Anio</th><th>Kg Cosechados</th><th>Agua (m3)</th><th>Gastos (EUR)</th><th>Ingresos (EUR)</th><th>Resultado (EUR)</th><th>EUR/kg</th></tr>
            </thead>
            <tbody>
              {years.map(y => {
                const kg = (cosechasByYear[y] || []).reduce((s, c) => s + (c.kg_totales || 0), 0);
                const agua = (riegosByYear[y] || []).reduce((s, r) => s + (r.volumen_m3 || 0), 0);
                const gastosYear = (gastosByYear[y] || []).reduce((s, g) => s + (g.importe || 0), 0);
                const ingresosYear = (ingresosByYear[y] || []).reduce((s, i) => s + (i.importe || 0), 0);
                const resultado = ingresosYear - gastosYear;
                const eurKg = kg > 0 ? (ingresosYear / kg).toFixed(2) : '-';
                return (
                  <tr key={y}>
                    <td><strong>{y}</strong></td>
                    <td>{kg.toLocaleString('es-ES')}</td>
                    <td>{agua.toLocaleString('es-ES')}</td>
                    <td>{gastosYear.toLocaleString('es-ES')} EUR</td>
                    <td>{ingresosYear.toLocaleString('es-ES')} EUR</td>
                    <td style={{ color: resultado >= 0 ? 'var(--verde-claro)' : 'var(--rojo)', fontWeight: 'bold' }}>{resultado.toLocaleString('es-ES')} EUR</td>
                    <td>{eurKg}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>Resumen por bancal</h3>
        <p style={{ color: 'var(--gris-medio)', fontSize: '0.9rem' }}>Coste por bancal en el anio actual</p>
      </div>

      {years.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div className="card-grid">
            <div className="card">
              <h3>Produccion total</h3>
              <div className="stat">{cosechas.reduce((s, c) => s + (c.kg_totales || 0), 0).toLocaleString('es-ES')} kg</div>
              <p>Todas las cosechas</p>
            </div>
            <div className="card">
              <h3>Rendimiento medio</h3>
              <div className="stat">{cosechas.length > 0 && cosechas.some(c => c.rendimiento_graso_pct) ? (cosechas.filter(c => c.rendimiento_graso_pct).reduce((s, c) => s + c.rendimiento_graso_pct, 0) / cosechas.filter(c => c.rendimiento_graso_pct).length).toFixed(1) + '%' : '-'}</div>
              <p>Graso</p>
            </div>
            <div className="card">
              <h3>Agua total</h3>
              <div className="stat">{riegos.reduce((s, r) => s + (r.volumen_m3 || 0), 0).toLocaleString('es-ES')} m3</div>
              <p>Consumido en riegos</p>
            </div>
            <div className="card">
              <h3>Coste del agua</h3>
              <div className="stat">{(() => { const aguaGasto = gastos.filter(g => g.categoria === 'riego').reduce((s, g) => s + g.importe, 0); return aguaGasto > 0 ? aguaGasto.toLocaleString('es-ES') + ' EUR' : '-'; })()}</div>
              <p>Gasto en riego</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}