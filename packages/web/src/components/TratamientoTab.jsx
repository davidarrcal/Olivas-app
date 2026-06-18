import { useState, useEffect } from 'react';
import api from '../api';
import { useConfirm } from '../hooks/useConfirm';
import { useToast } from '../hooks/useToast';

const PLAGAS = [
  'Mosca del olivo (Bactrocera oleae)',
  'Repilo o Antracnosis (Spilocaea oleagina)',
  'Verticilosis (Verticillium dahliae)',
  'Tuberculosis del olivo (Pseudomonas savastanoi)',
  'Polilla del olivo (Prays oleae)',
  'Cochinilla de la tizne (Saissetia oleae)',
  'Barrenillo del olivo (Phloeotribus scarabaeoides)',
  'Ara\u00f1a amarilla (Eriophyes oleae)',
  'Mosca blanca',
  'Otras'
];

const fechaHoy = () => new Date().toISOString().split('T')[0];
const formVacio = { fecha: fechaHoy(), producto_id: '', dosis: '', periodo_seguridad_dias: '', plaga_enfermedad: '', observaciones: '' };

export default function TratamientoTab({ bancalId, fincaId }) {
  const [tratamientos, setTratamientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(formVacio);
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  useEffect(() => { cargar(); cargarProductos(); }, [bancalId]);

  async function cargar() {
    const data = await api.get('/fincas/' + fincaId + '/bancales/' + bancalId + '/tratamientos');
    setTratamientos(data);
  }
  async function cargarProductos() {
    const data = await api.get('/productos?tipo=fitosanitario');
    setProductos(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const body = {
      fecha: form.fecha,
      producto_id: form.producto_id ? Number(form.producto_id) : null,
      dosis: form.dosis || null,
      periodo_seguridad_dias: form.periodo_seguridad_dias ? Number(form.periodo_seguridad_dias) : null,
      plaga_enfermedad: form.plaga_enfermedad || null,
      observaciones: form.observaciones || null
    };
    try {
      await api.post('/fincas/' + fincaId + '/bancales/' + bancalId + '/tratamientos', body);
      setShowForm(false);
      setForm(formVacio);
      showToast('Tratamiento creado correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al crear tratamiento', 'error');
    }
  }

  async function eliminar(id) {
    const ok = await confirm('Eliminar tratamiento', '¿Desea eliminar este tratamiento?');
    if (!ok) return;
    try {
      await api.del('/fincas/' + fincaId + '/bancales/' + bancalId + '/tratamientos/' + id);
      showToast('Tratamiento eliminado correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al eliminar tratamiento', 'error');
    }
  }

  function diasRestantes(fecha, periodo) {
    if (!periodo) return null;
    const fin = new Date(fecha);
    fin.setDate(fin.getDate() + periodo);
    const diff = Math.ceil((fin - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }

  return (
    <div>
      <div className="page-header">
        <h3>Sanidad (Tratamientos)</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Nuevo tratamiento</button>
      </div>

      {tratamientos.length === 0 ? (
        <div className="empty-state"><p>No hay tratamientos registrados.</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Fecha</th><th>Plaga/Enfermedad</th><th>Producto</th><th>Dosis</th><th>Periodo seguridad</th><th>Dias restantes</th><th></th></tr>
            </thead>
            <tbody>
              {tratamientos.map(t => {
                const diasRest = diasRestantes(t.fecha, t.periodo_seguridad_dias);
                return (
                  <tr key={t.id}>
                    <td>{new Date(t.fecha).toLocaleDateString('es-ES')}</td>
                    <td>{t.plaga_enfermedad || '-'}</td>
                    <td>{t.producto?.nombre || '-'}</td>
                    <td>{t.dosis || '-'}</td>
                    <td>{t.periodo_seguridad_dias ? t.periodo_seguridad_dias + ' dias' : '-'}</td>
                    <td>{diasRest !== null ? <span className={'badge ' + (diasRest === 0 ? 'badge-verde' : 'badge-naranja')}>{diasRest === 0 ? 'Cumplido' : diasRest + ' dias'}</span> : '-'}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => eliminar(t.id)}>X</button></td>
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
            <h3>Nuevo Tratamiento</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Fecha *</label>
                <input type="date" required value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Plaga/Enfermedad</label>
                  <select value={form.plaga_enfermedad} onChange={e => setForm({...form, plaga_enfermedad: e.target.value})}>
                    <option value="">-- Seleccionar --</option>
                    {PLAGAS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Producto</label>
                  <select value={form.producto_id} onChange={e => setForm({...form, producto_id: e.target.value})}>
                    <option value="">-- Ninguno --</option>
                    {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Dosis</label>
                  <input value={form.dosis} onChange={e => setForm({...form, dosis: e.target.value})} placeholder="Ej: 150 ml/hl" />
                </div>
                <div className="form-group">
                  <label>Periodo seguridad (dias)</label>
                  <input type="number" value={form.periodo_seguridad_dias} onChange={e => setForm({...form, periodo_seguridad_dias: e.target.value})} />
                </div>
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