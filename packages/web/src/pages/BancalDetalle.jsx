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
const formVariedadVacia = { variedad: '', num_arboles: '', ano_plantacion: '', produccion_estimada: '', observaciones: '' };

export default function BancalDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bancal, setBancal] = useState(null);
  const [tab, setTab] = useState('variedades');
  const [showVariedad, setShowVariedad] = useState(false);
  const [formVar, setFormVar] = useState(formVariedadVacia);
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  useEffect(() => { cargar(); }, [id]);

  async function cargar() {
    try {
      const data = await api.get('/bancales/' + id);
      setBancal(data);
    } catch (err) { console.error(err); }
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

  async function eliminarVariedad(varId) {
    const ok = await confirm('Eliminar variedad', '¿Desea eliminar esta variedad?');
    if (!ok) return;
    try {
      await api.del('/fincas/' + bancal.finca_id + '/bancales/variedades/' + varId);
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
            {bancal.superficie || '-'} ha | {bancal.textura_suelo || '-'} | Pendiente: {bancal.pendiente || '-'}% | Marco: {bancal.marco_plantacion || '-'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {bancal.variedades?.map((v, i) => (
            <span key={i} className="badge badge-verde">{v.variedad}: {v.num_arboles} arboles</span>
          ))}
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
            <tbody>{bancal.variedades?.map(v => (<tr key={v.id}><td><strong>{v.variedad}</strong></td><td>{v.num_arboles}</td><td>{v.ano_plantacion || '-'}</td><td>{v.produccion_estimada || '-'}</td><td><button className="btn btn-danger btn-sm" onClick={() => eliminarVariedad(v.id)}>X</button></td></tr>))}</tbody></table></div>
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
    </div>
  );
}