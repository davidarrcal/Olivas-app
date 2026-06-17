import { useState, useEffect } from 'react';
import api from '../api';

const TIPOS = [
  { valor: 'abono', etiqueta: 'Abono' },
  { valor: 'fitosanitario', etiqueta: 'Fitosanitario' },
  { valor: 'otro', etiqueta: 'Otro' }
];

const UNIDADES = ['kg', 'litros', 'gr', 'ml', 'unidades', 'L'];

const formVacio = { nombre: '', tipo: 'abono', composicion: '', unidad_medida: 'kg', precio_unitario: '', observaciones: '' };

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(formVacio);
  const [editId, setEditId] = useState(null);

  useEffect(() => { cargar(); }, [filtroTipo]);

  async function cargar() {
    const url = filtroTipo ? '/productos?tipo=' + filtroTipo : '/productos';
    const data = await api.get(url);
    setProductos(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const body = {
      nombre: form.nombre,
      tipo: form.tipo,
      composicion: form.composicion || null,
      unidad_medida: form.unidad_medida,
      precio_unitario: form.precio_unitario ? Number(form.precio_unitario) : null,
      observaciones: form.observaciones || null
    };
    if (editId) {
      await api.put('/productos/' + editId, body);
    } else {
      await api.post('/productos', body);
    }
    setShowForm(false);
    setForm(formVacio);
    setEditId(null);
    cargar();
  }

  async function eliminar(id) {
    if (!confirm('Eliminar este producto?')) return;
    await api.del('/productos/' + id);
    cargar();
  }

  function editar(p) {
    setEditId(p.id);
    setForm({
      nombre: p.nombre,
      tipo: p.tipo,
      composicion: p.composicion || '',
      unidad_medida: p.unidad_medida,
      precio_unitario: p.precio_unitario || '',
      observaciones: p.observaciones || ''
    });
    setShowForm(true);
  }

  return (
    <div>
      <div className="page-header">
        <h2>Productos</h2>
        <button className="btn btn-primary" onClick={() => { setEditId(null); setForm(formVacio); setShowForm(true); }}>+ Nuevo Producto</button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--gris-claro)' }}>
          <option value="">Todos</option>
          {TIPOS.map(t => <option key={t.valor} value={t.valor}>{t.etiqueta}</option>)}
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Tipo</th><th>Composicion</th><th>Unidad</th><th>Precio</th><th></th></tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <td><strong>{p.nombre}</strong></td>
                <td><span className={'badge ' + (p.tipo === 'abono' ? 'badge-verde' : p.tipo === 'fitosanitario' ? 'badge-rojo' : 'badge-azul')}>{TIPOS.find(t => t.valor === p.tipo)?.etiqueta || p.tipo}</span></td>
                <td>{p.composicion || '-'}</td>
                <td>{p.unidad_medida}</td>
                <td>{p.precio_unitario ? p.precio_unitario + ' EUR' : '-'}</td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => editar(p)} style={{ marginRight: '0.3rem' }}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => eliminar(p.id)}>X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre *</label>
                <input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Ej: Complejo 12-12-17" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo *</label>
                  <select required value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                    {TIPOS.map(t => <option key={t.valor} value={t.valor}>{t.etiqueta}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Unidad de medida *</label>
                  <select value={form.unidad_medida} onChange={e => setForm({...form, unidad_medida: e.target.value})}>
                    {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Composicion</label>
                <input value={form.composicion} onChange={e => setForm({...form, composicion: e.target.value})} placeholder="Ej: NPK 12-12-17 + 2MgO" />
              </div>
              <div className="form-group">
                <label>Precio unitario (EUR)</label>
                <input type="number" step="0.01" value={form.precio_unitario} onChange={e => setForm({...form, precio_unitario: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Observaciones</label>
                <textarea value={form.observaciones} onChange={e => setForm({...form, observaciones: e.target.value})} rows={2} />
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