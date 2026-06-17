import { createContext, useContext, useState, useCallback } from 'react';

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ open: false, title: '', message: '', resolve: null });

  const confirm = useCallback((title, message) => {
    return new Promise(resolve => {
      setState({ open: true, title, message, resolve });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setState(prev => ({ ...prev, open: false }));
    if (state.resolve) state.resolve(true);
  }, [state.resolve]);

  const handleCancel = useCallback(() => {
    setState(prev => ({ ...prev, open: false }));
    if (state.resolve) state.resolve(false);
  }, [state.resolve]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state.open && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <h3 style={{ color: '#c0392b' }}>{state.title}</h3>
            <p style={{ margin: '1rem 0', color: '#6b7c6b', lineHeight: '1.6' }}>{state.message}</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleConfirm} style={{ background: '#c0392b' }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}