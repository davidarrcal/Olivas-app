import { useState, useEffect } from 'react';
import api from '../api';
import { useConfirm } from '../hooks/useConfirm';
import { useToast } from '../hooks/useToast';

const formVacio = { producto_id: '', stock_actual: '', stock_minimo: '', precio_compra: '', fecha_ultima_compra: '' };

export default function Inventario() {
  const [fincaId, setFincaId] = useState(null);
  useEffect(() => {
    api.get('/fincas').then(fincas => {
      if (fincas.length > 0) setFincaId(fincas[0].id);
    });
  }, []);
  const [inventario, setInventario] = useState([]);
  const [productos, setProductos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(formVacio);
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  useEffect(() => { if (fincaId) cargar(); }, [fincaId]);

  async function cargar() {
    const [inv, prods, alert] = await Promise.all([
      api.get('/fincas/' + fincaId + '/inventario'),
      api.get('/productos'),
      api.get('/fincas/' + fincaId + '/inventario/alertas').catch(() => [])
    ]);
    setInventario(inv); setProductos(prods); setAlertas(alert);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const body = {
      producto_id: Number(form.producto_id),
      finca_id: Number(fincaId),
      stock_actual: Number(form.stock_actual),
      stock_minimo: form.stock_minimo ? Number(form.stock_minimo) : null,
      precio_compra: form.precio_compra ? Number(form.precio_compra) : null,
      fecha_ultima_compra: form.fecha_ultima_compra || null
    };
    try {
      if (editId) {
        await api.put('/inventario/' + editId, body);
        showToast('Inventario actualizado correctamente');
      } else {
        await api.post('/fincas/' + fincaId + '/inventario', body);
        showToast('Registro de inventario creado correctamente');
      }
      setShowForm(false); setForm(formVacio); setEditId(null); cargar();
    } catch (err) {
      showToast(err.message || 'Error al guardar inventario', 'error');
    }
  }

  async function eliminar(id) {
    const ok = await confirm('Eliminar registro', '¿Desea eliminar este registro del inventario?');
    if (!ok) return;
    try {
      await api.del('/inventario/' + id);
      showToast('Registro de inventario eliminado correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al eliminar registro de inventario', 'error');
    }
  }

  function editar(item) {
    setEditId(item.id);
    setForm({
      producto_id: String(item.producto_id), stock_actual: String(item.stock_actual),
      stock_minimo: item.stock_minimo ? String(item.stock_minimo) : '',
      precio_compra: item.precio_compra ? String(item.precio_compra) : '',
      fecha_ultima_compra: item.fecha_ultima_compra ? item.fecha_ultima_compra.split('T')[0] : ''
    });
    setShowForm(true);
  }

  if (!fincaId) return <div className="empty-state"><p>Cargando...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h2>Inventario / Stock</h2>
        <button className="btn btn-primary" onClick={() => { setEditId(null); setForm(formVacio); setShowForm(true); }}>+ Anadir al inventario</button>
      </div>

      {alertas.length > 0 && (
        <div className="alerta alerta-aviso" style={{ marginBottom: '1rem' }}>
          <strong>Alertas de stock bajo:</strong> {alertas.map(a => a.producto?.nombre + ' (stock: ' + a.stock_actual + ', min: ' + (a.stock_minimo ?? '-') + ')').join(', ')}
        </div>
      )}

      {inventario.length === 0 ? (
        <div className="empty-state"><p>No hay productos en el inventario.</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Producto</th><th>Tipo</th><th>Stock actual</th><th>Stock minimo</th><th>Precio compra</th><th>Ultima compra</th><th></th></tr></thead>
            <tbody>
              {inventario.map(item => {
                const bajo = item.stock_minimo && item.stock_actual <= item.stock_minimo;
                return (
                  <tr key={item.id} style={bajo ? { background: '#fff3cd' } : {}}>
                    <td><strong>{item.producto?.nombre || '-'}</strong></td>
                    <td>{item.producto?.tipo || '-'}</td>
                    <td style={bajo ? { color: 'var(--naranja)', fontWeight: 'bold' } : {}}>{item.stock_actual} {item.producto?.unidad_medida || ''}</td>
                    <td>{item.stock_minimo ?? '-'}</td>
                    <td>{item.precio_compra ? item.precio_compra + ' EUR' : '-'}</td>
                    <td>{item.fecha_ultima_compra ? new Date(item.fecha_ultima_compra).toLocaleDateString('es-ES') : '-'}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => editar(item)} style={{ marginRight: '0.3rem' }}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => eliminar(item.id)}>X</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editId ? 'Editar Inventario' : 'Anadir al Inventario'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Producto *</label>
                <select required value={form.producto_id} onChange={e => setForm({...form, producto_id: e.target.value})}>
                  <option value="">-- Seleccionar --</option>
                  {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.tipo})</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Stock actual *</label><input type="number" step="0.01" required value={form.stock_actual} onChange={e => setForm({...form, stock_actual: e.target.value})} /></div>
                <div className="form-group"><label>Stock minimo (alerta)</label><input type="number" step="0.01" value={form.stock_minimo} onChange={e => setForm({...form, stock_minimo: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Precio compra (EUR)</label><input type="number" step="0.01" value={form.precio_compra} onChange={e => setForm({...form, precio_compra: e.target.value})} /></div>
                <div className="form-group"><label>Fecha ultima compra</label><input type="date" value={form.fecha_ultima_compra} onChange={e => setForm({...form, fecha_ultima_compra: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Guardar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}