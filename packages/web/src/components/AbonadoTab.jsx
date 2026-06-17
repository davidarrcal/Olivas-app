import { useState, useEffect } from 'react';
import api from '../api';
import { useConfirm } from '../hooks/useConfirm';
import { useToast } from '../hooks/useToast';

const TIPOS_ABONO = [
  { valor: 'suelo', etiqueta: 'Suelo (granulado)' },
  { valor: 'foliar', etiqueta: 'Foliar' },
  { valor: 'fertirriego', etiqueta: 'Fertirriego (goteo)' },
  { valor: 'organico', etiqueta: 'Organico (compost/estiercol)' }
];

const ESTADOS_FENOLOGICOS = [
  { valor: 'reposo_invernal', etiqueta: 'Reposo invernal' },
  { valor: 'yema_hinchada', etiqueta: 'Yema hinchada' },
  { valor: 'apertura_yemas', etiqueta: 'Apertura de yemas' },
  { valor: 'hojas_nacientes', etiqueta: 'Hojas nacientes' },
  { valor: 'diferenciacion_floral', etiqueta: 'Diferenciacion floral' },
  { valor: 'boton_floral', etiqueta: 'Boton floral' },
  { valor: 'floracion', etiqueta: 'Floracion' },
  { valor: 'cuajado', etiqueta: 'Cuajado' },
  { valor: 'endurecimiento_hueso', etiqueta: 'Endurecimiento del hueso' },
  { valor: 'engorde_fruto', etiqueta: 'Engorde del fruto' },
  { valor: 'envero', etiqueta: 'Envero (cambio de color)' },
  { valor: 'maduracion', etiqueta: 'Maduracion' },
  { valor: 'recoleccion', etiqueta: 'Recoleccion' }
];

const fechaHoy = () => new Date().toISOString().split('T')[0];

const formVacio = { fecha: fechaHoy(), tipo: 'suelo', producto_id: '', npk: '', dosis: '', dosis_unidad: 'kg/ha', estado_fenologico: '', observaciones: '' };

export default function AbonadoTab({ bancalId, fincaId }) {
  const [abonados, setAbonados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(formVacio);
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  useEffect(() => { cargar(); cargarProductos(); }, [bancalId]);

  async function cargar() {
    const data = await api.get('/fincas/' + fincaId + '/bancales/' + bancalId + '/abonados');
    setAbonados(data);
  }
  async function cargarProductos() {
    const data = await api.get('/productos?tipo=abono');
    setProductos(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const body = {
      fecha: form.fecha,
      tipo: form.tipo,
      producto_id: form.producto_id ? Number(form.producto_id) : null,
      npk: form.npk || null,
      dosis: form.dosis ? Number(form.dosis) : null,
      dosis_unidad: form.dosis_unidad || null,
      estado_fenologico: form.estado_fenologico || null,
      observaciones: form.observaciones || null
    };
    try {
      await api.post('/fincas/' + fincaId + '/bancales/' + bancalId + '/abonados', body);
      setShowForm(false);
      setForm(formVacio);
      showToast('Abonado creado correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al crear abonado', 'error');
    }
  }

  async function eliminar(id) {
    const ok = await confirm('Eliminar abonado', '¿Desea eliminar este abonado?');
    if (!ok) return;
    try {
      await api.del('/abonados/' + id);
      showToast('Abonado eliminado correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al eliminar abonado', 'error');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h3>Abonado</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Nuevo abonado</button>
      </div>

      {abonados.length === 0 ? (
        <div className="empty-state"><p>No hay registros de abonado.</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Fecha</th><th>Tipo</th><th>Producto</th><th>NPK</th><th>Dosis</th><th>Estado Fenologico</th><th></th></tr>
            </thead>
            <tbody>
              {abonados.map(a => (
                <tr key={a.id}>
                  <td>{new Date(a.fecha).toLocaleDateString('es-ES')}</td>
                  <td><span className={'badge ' + (a.tipo === 'organico' ? 'badge-verde' : 'badge-azul')}>{TIPOS_ABONO.find(t => t.valor === a.tipo)?.etiqueta || a.tipo}</span></td>
                  <td>{a.producto?.nombre || '-'}</td>
                  <td>{a.npk || '-'}</td>
                  <td>{a.dosis ? a.dosis + ' ' + (a.dosis_unidad || '') : '-'}</td>
                  <td>{ESTADOS_FENOLOGICOS.find(e => e.valor === a.estado_fenologico)?.etiqueta || '-'}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => eliminar(a.id)}>X</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Nuevo Abonado</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha *</label>
                  <input type="date" required value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Tipo *</label>
                  <select required value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                    {TIPOS_ABONO.map(t => <option key={t.valor} value={t.valor}>{t.etiqueta}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Producto</label>
                  <select value={form.producto_id} onChange={e => setForm({...form, producto_id: e.target.value})}>
                    <option value="">-- Ninguno --</option>
                    {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Composicion NPK</label>
                  <input value={form.npk} onChange={e => setForm({...form, npk: e.target.value})} placeholder="Ej: 12-12-17" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Dosis</label>
                  <input type="number" step="0.1" value={form.dosis} onChange={e => setForm({...form, dosis: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Unidad de dosis</label>
                  <select value={form.dosis_unidad} onChange={e => setForm({...form, dosis_unidad: e.target.value})}>
                    <option value="kg/ha">kg/ha</option>
                    <option value="gr/árbol">gr/arbol</option>
                    <option value="kg/100L">kg/100L</option>
                    <option value="L/ha">L/ha</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Estado fenologico</label>
                <select value={form.estado_fenologico} onChange={e => setForm({...form, estado_fenologico: e.target.value})}>
                  <option value="">-- Seleccionar --</option>
                  {ESTADOS_FENOLOGICOS.map(e => <option key={e.valor} value={e.valor}>{e.etiqueta}</option>)}
                </select>
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