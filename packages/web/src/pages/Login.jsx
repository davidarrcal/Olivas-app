import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, nombre);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesion');
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #2d5a27 0%, #4a7c3f 50%, #6b8f23 100%)'
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🫒</div>
          <h1 style={{ color: '#2d5a27', margin: 0, fontSize: '1.8rem' }}>Olivas</h1>
          <p style={{ color: '#6b7c6b', margin: '0.5rem 0 0' }}>Gestion agricola</p>
        </div>

        {error && (
          <div style={{
            background: '#fde8e8', color: '#c0392b', padding: '0.75rem', borderRadius: '8px',
            marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', color: '#2d5a27', fontWeight: '500', fontSize: '0.9rem' }}>Nombre</label>
              <input
                type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                required placeholder="Tu nombre"
                style={{
                  width: '100%', padding: '0.7rem', border: '2px solid #d4e8d4', borderRadius: '8px',
                  fontSize: '1rem', transition: 'border-color 0.2s',
                  outline: 'none', boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#4a7c3f'}
                onBlur={e => e.target.style.borderColor = '#d4e8d4'}
              />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', color: '#2d5a27', fontWeight: '500', fontSize: '0.9rem' }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="tu@email.es"
              style={{
                width: '100%', padding: '0.7rem', border: '2px solid #d4e8d4', borderRadius: '8px',
                fontSize: '1rem', transition: 'border-color 0.2s',
                outline: 'none', boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = '#4a7c3f'}
              onBlur={e => e.target.style.borderColor = '#d4e8d4'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', color: '#2d5a27', fontWeight: '500', fontSize: '0.9rem' }}>Contrasena</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="Minimo 6 caracteres" minLength={6}
              style={{
                width: '100%', padding: '0.7rem', border: '2px solid #d4e8d4', borderRadius: '8px',
                fontSize: '1rem', transition: 'border-color 0.2s',
                outline: 'none', boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = '#4a7c3f'}
              onBlur={e => e.target.style.borderColor = '#d4e8d4'}
            />
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '0.8rem', background: '#2d5a27', color: '#fff',
              border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              transition: 'background 0.2s'
            }}
            onMouseOver={e => !loading && (e.target.style.background = '#4a7c3f')}
            onMouseOut={e => e.target.style.background = '#2d5a27'}
          >
            {loading ? 'Cargando...' : isRegister ? 'Crear cuenta' : 'Entrar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <span style={{ color: '#6b7c6b' }}>{isRegister ? 'Ya tienes cuenta?' : 'No tienes cuenta?'}</span>
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{
              background: 'none', border: 'none', color: '#2d5a27', fontWeight: '600',
              cursor: 'pointer', marginLeft: '0.3rem', fontSize: '0.9rem', textDecoration: 'underline'
            }}
          >
            {isRegister ? 'Iniciar sesion' : 'Crear cuenta'}
          </button>
        </div>
      </div>
    </div>
  );
}