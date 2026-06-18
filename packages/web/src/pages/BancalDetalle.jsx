import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useConfirm } from '../hooks/useConfirm';
import { useToast } from '../hooks/useToast';
import RiegoTab from '../components/RiegoTab';
import AbonadoTab from '../components/AbonadoTab';
import TratamientoTab from '../components/TratamientoTab';
import PodaTab from '../components/PodaTab';
import CosechaTab from '../components/CosechaTab';
import AnalisisTab from '../components/AnalisisTab';
import DiarioCampoTab from '../components/DiarioCampoTab';

const VARIEDADES = ['Picual','Hojiblanca','Cornicabra','Manzanilla Cacere\u00f1a','Manzanilla Sevillana','Arbequina','Empeltre','Verdial de Badajoz','Lechin de Sevilla','Morisca','Gordal','Castellana'];
const TEXTURAS = [
  { valor: 'arcilloso', etiqueta: 'Arcilloso' },
  { valor: 'franco_arcilloso', etiqueta: 'Franco-arcilloso' },
  { valor: 'franco', etiqueta: 'Franco' },
  { valor: 'franco_arenoso', etiqueta: 'Franco-arenoso' },
  { valor: 'arenoso', etiqueta: 'Arenoso' }
];
const formVariedadVacia = { variedad: '', num_arboles: '', ano_plantacion: '', produccion_estimada: '', observaciones: '' };

export default function BancalDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bancal, setBancal] = useState(null);
  const [tab, setTab] = useState('variedades');
  const [showVariedad, setShowVariedad] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({});
  const [formVar, setFormVar] = useState(formVariedadVacia);
  const [editVarId, setEditVarId] = useState(null);
  const [editVarForm, setEditVarForm] = useState({});
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  useEffect(() => { cargar(); }, [id]);

  async function cargar() {
    try {
      const data = await api.get('/bancales/' + id);
      setBancal(data);
      setForm({
        nombre: data.nombre || '',
        superficie: data.superficie || '',
        textura_suelo: data.textura_suelo || '',
        pendiente: data.pendiente || '',
        marco_plantacion: data.marco_plantacion || '',
        observaciones: data.observaciones || ''
      });
    } catch (err) { console.error(err); }
  }

  async function guardarBancal(e) {
    e.preventDefault();
    try {
      await api.put('/fincas/' + bancal.finca_id + '/bancales/' + id, {
        finca_id: bancal.finca_id,
        nombre: form.nombre,
        superficie: form.superficie ? Number(form.superficie) : null,
        textura_suelo: form.textura_suelo || null,
        pendiente: form.pendiente ? Number(form.pendiente) : null,
        marco_plantacion: form.marco_plantacion || null,
        observaciones: form.observaciones || null
      });
      setShowEdit(false);
      showToast('Bancal actualizado correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al actualizar bancal', 'error');
    }
  }

  async function crearVariedad(e) {
    e.preventDefault();
    try {
      await api.post('/fincas/' + bancal.finca_id + '/bancales/' + id + '/variedades', {
        variedad: formVar.variedad, num_arboles: Number(formVar.num_arboles),
        ano_plantacion: formVar.ano_plantacion ? Number(formVar.ano_plantacion) : null,
        produccion_estimada: formVar.produccion_estimada ? Number(formVar.produccion_estimada) : null,
        observaciones: formVar.observaciones || null
      });
      setShowVariedad(false); setFormVar(formVariedadVacia);
      showToast('Variedad creada correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al crear variedad', 'error');
    }
  }

  async function guardarVariedad() {
    try {
      await api.put('/fincas/' + bancal.finca_id + '/bancales/' + id + '/variedades/' + editVarId, {
        variedad: editVarForm.variedad,
        num_arboles: Number(editVarForm.num_arboles),
        ano_plantacion: editVarForm.ano_plantacion ? Number(editVarForm.ano_plantacion) : null,
        produccion_estimada: editVarForm.produccion_estimada ? Number(editVarForm.produccion_estimada) : null,
        observaciones: editVarForm.observaciones || null
      });
      setEditVarId(null);
      showToast('Variedad actualizada');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al actualizar variedad', 'error');
    }
  }

  async function eliminarVariedad(varId) {
    const ok = await confirm('Eliminar variedad', 'Desea eliminar esta variedad?');
    if (!ok) return;
    try {
      await api.del('/fincas/' + bancal.finca_id + '/bancales/' + id + '/variedades/' + varId);
      showToast('Variedad eliminada correctamente');
      cargar();
    } catch (err) {
      showToast(err.message || 'Error al eliminar variedad', 'error');
    }
  }

  if (!bancal) return <div className="empty-state"><h3>Cargando...</h3></div>;

  const tabs = [
    { id: 'variedades', label: 'Variedades' },
    { id: 'riegos', label: 'Riegos' },
    { id: 'abonados', label: 'Abonado' },
    { id: 'tratamientos', label: 'Sanidad' },
    { id: 'podas', label: 'Podas' },
    { id: 'cosechas', label: 'Cosecha' },
    { id: 'analisis', label: 'Analisis' },
    { id: 'diario', label: 'Diario' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/fincas/' + bancal.finca_id)} style={{ marginRight: '0.5rem' }}>&larr; Volver</button>
          <h2 style={{ display: 'inline' }}>{bancal.nombre}</h2>
          <p style={{ color: 'var(--gris-medio)', marginTop: '0.25rem' }}>
            {bancal.superficie || '-'} ha | {TEXTURAS.find(t => t.valor === bancal.textura_suelo)?.etiqueta || '-'} | Pendiente: {bancal.pendiente || '-'}% | Marco: {bancal.marco_plantacion || '-'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          {bancal.variedades?.map((v, i) => (
            <span key={i} className="badge badge-verde">{v.variedad}: {v.num_arboles} arboles</span>
          ))}
          <button className="btn btn-secondary btn-sm" onClick={() => setShowEdit(true)}>Editar bancal</button>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(t => (
          <button key={t.id} className={'tab' + (tab === t.id ? ' active' : '')} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {tab === 'variedades' && (
        <div>
          <div className="page-header"><h3>Variedades</h3><button className="btn btn-primary btn-sm" onClick={() => setShowVariedad(true)}>+ Anadir variedad</button></div>
          {bancal.variedades?.length === 0 ? (<div className="empty-state"><p>No hay variedades.</p></div>) : (
            <div className="table-container"><table><thead><tr><th>Variedad</th><th>N. Arboles</th><th>Ano</th><th>Prod. Est. (kg)</th><th></th></tr></thead>
            <tbody>{bancal.variedades?.map(v => (
              <tr key={v.id}>
                {editVarId === v.id ? (
                  <>
                    <td><select value={editVarForm.variedad} onChange={e => setEditVarForm({...editVarForm, variedad: e.target.value})}><option value="">-- Seleccionar --</option>{VARIEDADES.map(va => <option key={va} value={va}>{va}</option>)}</select></td>
                    <td><input type="number" value={editVarForm.num_arboles} onChange={e => setEditVarForm({...editVarForm, num_arboles: e.target.value})} style={{width:'70px'}} /></td>
                    <td><input type="number" value={editVarForm.ano_plantacion} onChange={e => setEditVarForm({...editVarForm, ano_plantacion: e.target.value})} style={{width:'80px'}} /></td>
                    <td><input type="number" value={editVarForm.produccion_estimada} onChange={e => setEditVarForm({...editVarForm, produccion_estimada: e.target.value})} style={{width:'80px'}} /></td>
                    <td style={{ display: 'flex', gap: '0.3rem' }}>
                      <button className="btn btn-primary btn-sm" onClick={guardarVariedad}>Guardar</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditVarId(null)}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td><strong>{v.variedad}</strong></td>
                    <td>{v.num_arboles}</td>
                    <td>{v.ano_plantacion || '-'}</td>
                    <td>{v.produccion_estimada || '-'}</td>
                    <td style={{ display: 'flex', gap: '0.3rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => { setEditVarId(v.id); setEditVarForm({ variedad: v.variedad, num_arboles: v.num_arboles, ano_plantacion: v.ano_plantacion || '', produccion_estimada: v.produccion_estimada || '', observaciones: v.observaciones || '' }); }}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => eliminarVariedad(v.id)}>X</button>
                    </td>
                  </>
                )}
              </tr>
            ))}</tbody></table></div>
          )}
          {showVariedad && (
            <div className="modal-overlay" onClick={() => setShowVariedad(false)}><div className="modal" onClick={e => e.stopPropagation()}>
              <h3>Nueva Variedad</h3><form onSubmit={crearVariedad}>
                <div className="form-group"><label>Variedad *</label><select required value={formVar.variedad} onChange={e => setFormVar({...formVar, variedad: e.target.value})}><option value="">-- Seleccionar --</option>{VARIEDADES.map(v => <option key={v} value={v}>{v}</option>)}</select></div>
                <div className="form-row"><div className="form-group"><label>N. Arboles *</label><input type="number" required value={formVar.num_arboles} onChange={e => setFormVar({...formVar, num_arboles: e.target.value})} /></div><div className="form-group"><label>Ano Plantacion</label><input type="number" value={formVar.ano_plantacion} onChange={e => setFormVar({...formVar, ano_plantacion: e.target.value})} /></div></div>
                <div className="form-group"><label>Produccion estimada (kg)</label><input type="number" value={formVar.produccion_estimada} onChange={e => setFormVar({...formVar, produccion_estimada: e.target.value})} /></div>
                <div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={() => setShowVariedad(false)}>Cancelar</button><button type="submit" className="btn btn-primary">Crear</button></div>
              </form></div></div>
          )}
        </div>
      )}

      {tab === 'riegos' && <RiegoTab bancalId={Number(id)} fincaId={bancal.finca_id} />}
      {tab === 'abonados' && <AbonadoTab bancalId={Number(id)} fincaId={bancal.finca_id} />}
      {tab === 'tratamientos' && <TratamientoTab bancalId={Number(id)} fincaId={bancal.finca_id} />}
      {tab === 'podas' && <PodaTab bancalId={Number(id)} fincaId={bancal.finca_id} />}
      {tab === 'cosechas' && <CosechaTab bancalId={Number(id)} fincaId={bancal.finca_id} />}
      {tab === 'analisis' && <AnalisisTab bancalId={Number(id)} fincaId={bancal.finca_id} />}
      {tab === 'diario' && <DiarioCampoTab bancalId={Number(id)} fincaId={bancal.finca_id} />}

      {showEdit && (
        <div className="modal-overlay" onClick={() => setShowEdit(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Editar Bancal</h3>
            <form onSubmit={guardarBancal}>
              <div className="form-group">
                <label>Nombre *</label>
                <input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Superficie (ha)</label>
                  <input type="number" step="0.1" value={form.superficie} onChange={e => setForm({...form, superficie: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Pendiente (%)</label>
                  <input type="number" step="0.1" value={form.pendiente} onChange={e => setForm({...form, pendiente: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Textura del suelo</label>
                  <select value={form.textura_suelo} onChange={e => setForm({...form, textura_suelo: e.target.value})}>
                    <option value="">-- Seleccionar --</option>
                    {TEXTURAS.map(t => <option key={t.valor} value={t.valor}>{t.etiqueta}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Marco de plantacion</label>
                  <input value={form.marco_plantacion} onChange={e => setForm({...form, marco_plantacion: e.target.value})} placeholder="Ej: 7x4" />
                </div>
              </div>
              <div className="form-group">
                <label>Observaciones</label>
                <textarea value={form.observaciones} onChange={e => setForm({...form, observaciones: e.target.value})} rows={2} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEdit(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}