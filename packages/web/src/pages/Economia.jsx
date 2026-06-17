import { useState, useEffect } from 'react';
import api from '../api';
import { useConfirm } from '../hooks/useConfirm';
import { useToast } from '../hooks/useToast';

const CATEGORIAS_GASTO = [
  { valor: 'abono', etiqueta: 'Abono' },
  { valor: 'fitosanitario', etiqueta: 'Fitosanitario' },
  { valor: 'riego', etiqueta: 'Riego' },
  { valor: 'combustible', etiqueta: 'Combustible' },
  { valor: 'mantenimiento', etiqueta: 'Mantenimiento' },
  { valor: 'almazara', etiqueta: 'Almazara' },
  { valor: 'transporte', etiqueta: 'Transporte' },
  { valor: 'seguro', etiqueta: 'Seguro' },
  { valor: 'otros', etiqueta: 'Otros' }
];

const CATEGORIAS_INGRESO = [
  { valor: 'venta_aceituna', etiqueta: 'Venta aceituna' },
  { valor: 'venta_aceite', etiqueta: 'Venta aceite' },
  { valor: 'subvencion', etiqueta: 'Subvencion' },
  { valor: 'otros', etiqueta: 'Otros' }
];

const fechaHoy = () => new Date().toISOString().split('T')[0];
const formGastoVacio = { fecha: fechaHoy(), concepto: '', categoria: 'abono', importe: '', bancal_id: '', observaciones: '' };
const formIngresoVacio = { fecha: fechaHoy(), concepto: '', categoria: 'venta_aceituna', importe: '', kg_vendidos: '', precio_kg: '', observaciones: '' };

export default function Economia() {
  const [fincaId, setFincaId] = useState(null);
  useEffect(() => {
    api.get('/fincas').then(fincas => {
      if (fincas.length > 0) setFincaId(fincas[0].id);
    });
  }, []);
  const [tab, setTab] = useState('gastos');
  const [gastos, setGastos] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [resumenGastos, setResumenGastos] = useState(null);
  const [resumenIngresos, setResumenIngresos] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(formGastoVacio);
  const [bancales, setBancales] = useState([]);
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  useEffect(() => { if (fincaId) cargarTodo(); }, [fincaId]);

  async function cargarTodo() {
    const [g, i, rg, ri, b] = await Promise.all([
      api.get('/fincas/' + fincaId + '/gastos'),
      api.get('/fincas/' + fincaId + '/ingresos'),
      api.get('/fincas/' + fincaId + '/gastos/resumen'),
      api.get('/fincas/' + fincaId + '/ingresos/resumen'),
      api.get('/fincas/' + fincaId + '/bancales')
    ]);
    setGastos(g); setIngresos(i); setResumenGastos(rg); setResumenIngresos(ri); setBancales(b);
  }

  async function handleSubmitGasto(e) {
    e.preventDefault();
    try {
      await api.post('/fincas/' + fincaId + '/gastos', {
        finca_id: Number(fincaId),
        fecha: form.fecha, concepto: form.concepto, categoria: form.categoria,
        importe: Number(form.importe),
        bancal_id: form.bancal_id ? Number(form.bancal_id) : null,
        observaciones: form.observaciones || null
      });
      setShowForm(false); setForm(tab === 'gastos' ? formGastoVacio : formIngresoVacio);
      showToast('Gasto creado correctamente');
      cargarTodo();
    } catch (err) {
      showToast(err.message || 'Error al crear gasto', 'error');
    }
  }

  async function handleSubmitIngreso(e) {
    e.preventDefault();
    try {
      await api.post('/fincas/' + fincaId + '/ingresos', {
        finca_id: Number(fincaId),
        fecha: form.fecha, concepto: form.concepto, categoria: form.categoria,
        importe: Number(form.importe),
        kg_vendidos: form.kg_vendidos ? Number(form.kg_vendidos) : null,
        precio_kg: form.precio_kg ? Number(form.precio_kg) : null,
        observaciones: form.observaciones || null
      });
      setShowForm(false); setForm(formIngresoVacio);
      showToast('Ingreso creado correctamente');
      cargarTodo();
    } catch (err) {
      showToast(err.message || 'Error al crear ingreso', 'error');
    }
  }

  async function eliminarGasto(id) {
    const ok = await confirm('Eliminar gasto', '¿Desea eliminar este gasto?');
    if (!ok) return;
    try {
      await api.del('/gastos/' + id);
      showToast('Gasto eliminado correctamente');
      cargarTodo();
    } catch (err) {
      showToast(err.message || 'Error al eliminar gasto', 'error');
    }
  }
  async function eliminarIngreso(id) {
    const ok = await confirm('Eliminar ingreso', '¿Desea eliminar este ingreso?');
    if (!ok) return;
    try {
      await api.del('/ingresos/' + id);
      showToast('Ingreso eliminado correctamente');
      cargarTodo();
    } catch (err) {
      showToast(err.message || 'Error al eliminar ingreso', 'error');
    }
  }

  const beneficio = (resumenGastos?.total || 0) - (resumenIngresos?.total || 0);

  if (!fincaId) return <div className="empty-state"><p>Cargando...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h2>Gestion Economica</h2>
      </div>

      <div className="card-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="card"><h3>Gastos</h3><div className="stat" style={{ color: 'var(--rojo)' }}>{(resumenGastos?.total || 0).toLocaleString('es-ES')} EUR</div></div>
        <div className="card"><h3>Ingresos</h3><div className="stat" style={{ color: 'var(--verde-claro)' }}>{(resumenIngresos?.total || 0).toLocaleString('es-ES')} EUR</div></div>
        <div className="card"><h3>Resultado</h3><div className="stat" style={{ color: beneficio >= 0 ? 'var(--verde-claro)' : 'var(--rojo)' }}>{beneficio.toLocaleString('es-ES')} EUR</div></div>
        <div className="card"><h3>Kg vendidos</h3><div className="stat">{(resumenIngresos?.totalKg || 0).toLocaleString('es-ES')} kg</div></div>
      </div>

      <div className="tabs">
        <button className={'tab' + (tab === 'gastos' ? ' active' : '')} onClick={() => setTab('gastos')}>Gastos</button>
        <button className={'tab' + (tab === 'ingresos' ? ' active' : '')} onClick={() => setTab('ingresos')}>Ingresos</button>
      </div>

      {tab === 'gastos' && (
        <div>
          <div className="page-header">
            <h3>Gastos</h3>
            <button className="btn btn-primary btn-sm" onClick={() => { setForm(formGastoVacio); setShowForm(true); }}>+ Nuevo gasto</button>
          </div>
          <div className="table-container">
            <table>
              <thead><tr><th>Fecha</th><th>Categoria</th><th>Concepto</th><th>Bancal</th><th>Importe</th><th></th></tr></thead>
              <tbody>
                {gastos.map(g => (
                  <tr key={g.id}>
                    <td>{new Date(g.fecha).toLocaleDateString('es-ES')}</td>
                    <td><span className="badge badge-naranja">{CATEGORIAS_GASTO.find(c => c.valor === g.categoria)?.etiqueta || g.categoria}</span></td>
                    <td>{g.concepto}</td>
                    <td>{g.bancal?.nombre || '-'}</td>
                    <td><strong>{g.importe.toLocaleString('es-ES')} EUR</strong></td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => eliminarGasto(g.id)}>X</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {gastos.length === 0 && <div className="empty-state"><p>No hay gastos registrados.</p></div>}
        </div>
      )}

      {tab === 'ingresos' && (
        <div>
          <div className="page-header">
            <h3>Ingresos</h3>
            <button className="btn btn-primary btn-sm" onClick={() => { setForm(formIngresoVacio); setShowForm(true); }}>+ Nuevo ingreso</button>
          </div>
          <div className="table-container">
            <table>
              <thead><tr><th>Fecha</th><th>Categoria</th><th>Concepto</th><th>Kg vendidos</th><th>Precio/kg</th><th>Importe</th><th></th></tr></thead>
              <tbody>
                {ingresos.map(i => (
                  <tr key={i.id}>
                    <td>{new Date(i.fecha).toLocaleDateString('es-ES')}</td>
                    <td><span className="badge badge-verde">{CATEGORIAS_INGRESO.find(c => c.valor === i.categoria)?.etiqueta || i.categoria}</span></td>
                    <td>{i.concepto}</td>
                    <td>{i.kg_vendidos ? i.kg_vendidos.toLocaleString('es-ES') + ' kg' : '-'}</td>
                    <td>{i.precio_kg ? i.precio_kg + ' EUR/kg' : '-'}</td>
                    <td><strong>{i.importe.toLocaleString('es-ES')} EUR</strong></td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => eliminarIngreso(i.id)}>X</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {ingresos.length === 0 && <div className="empty-state"><p>No hay ingresos registrados.</p></div>}
        </div>
      )}

      {showForm && tab === 'gastos' && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Nuevo Gasto</h3>
            <form onSubmit={handleSubmitGasto}>
              <div className="form-row">
                <div className="form-group"><label>Fecha *</label><input type="date" required value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} /></div>
                <div className="form-group"><label>Categoria *</label>
                  <select required value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}>
                    {CATEGORIAS_GASTO.map(c => <option key={c.valor} value={c.valor}>{c.etiqueta}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Concepto *</label><input required value={form.concepto} onChange={e => setForm({...form, concepto: e.target.value})} /></div>
              <div className="form-row">
                <div className="form-group"><label>Importe (EUR) *</label><input type="number" step="0.01" required value={form.importe} onChange={e => setForm({...form, importe: e.target.value})} /></div>
                <div className="form-group"><label>Bancal (opcional)</label>
                  <select value={form.bancal_id} onChange={e => setForm({...form, bancal_id: e.target.value})}>
                    <option value="">-- Ninguno --</option>
                    {bancales.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Observaciones</label><textarea value={form.observaciones} onChange={e => setForm({...form, observaciones: e.target.value})} rows={2} /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showForm && tab === 'ingresos' && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Nuevo Ingreso</h3>
            <form onSubmit={handleSubmitIngreso}>
              <div className="form-row">
                <div className="form-group"><label>Fecha *</label><input type="date" required value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} /></div>
                <div className="form-group"><label>Categoria *</label>
                  <select required value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}>
                    {CATEGORIAS_INGRESO.map(c => <option key={c.valor} value={c.valor}>{c.etiqueta}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Concepto *</label><input required value={form.concepto} onChange={e => setForm({...form, concepto: e.target.value})} /></div>
              <div className="form-row">
                <div className="form-group"><label>Importe (EUR) *</label><input type="number" step="0.01" required value={form.importe} onChange={e => setForm({...form, importe: e.target.value})} /></div>
                <div className="form-group"><label>Kg vendidos</label><input type="number" step="0.1" value={form.kg_vendidos} onChange={e => setForm({...form, kg_vendidos: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Precio/kg (EUR)</label><input type="number" step="0.01" value={form.precio_kg} onChange={e => setForm({...form, precio_kg: e.target.value})} /></div>
                <div></div>
              </div>
              <div className="form-group"><label>Observaciones</label><textarea value={form.observaciones} onChange={e => setForm({...form, observaciones: e.target.value})} rows={2} /></div>
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