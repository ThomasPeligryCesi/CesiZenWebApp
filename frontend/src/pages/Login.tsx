import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erreur de connexion');
        return;
      }
      if (data.role !== 'admin') {
        setError('Accès réservé aux administrateurs');
        return;
      }
      localStorage.setItem('refreshToken', data.refreshToken);
      onLogin(data.token);
    } catch {
      setError('Erreur réseau');
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Backoffice CesiZen</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="primary" style={{ width: '100%' }}>Se connecter</button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          <Link to="/forgot-password">Mot de passe oublié ?</Link>
        </p>
      </div>
    </div>
  );
}
