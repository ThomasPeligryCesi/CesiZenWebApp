import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Lien invalide</h1>
          <p>Aucun token de réinitialisation trouvé.</p>
          <p style={{ marginTop: '16px', textAlign: 'center' }}>
            <Link to="/forgot-password">Demander un nouveau lien</Link>
          </p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue');
        return;
      }
      setSuccess(true);
    } catch {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Mot de passe réinitialisé</h1>
          <p>Votre mot de passe a été modifié avec succès.</p>
          <p style={{ marginTop: '16px', textAlign: 'center' }}>
            <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Nouveau mot de passe</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nouveau mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
          </div>
          <div className="field">
            <label>Confirmer le mot de passe</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
}
