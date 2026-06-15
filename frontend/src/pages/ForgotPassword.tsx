import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Une erreur est survenue');
        return;
      }
      setSubmitted(true);
    } catch {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Email envoyé</h1>
          <p>Si cet email est associé à un compte, vous recevrez un lien de réinitialisation.</p>
          <p style={{ marginTop: '16px', textAlign: 'center' }}>
            <Link to="/login">Retour à la connexion</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Mot de passe oublié</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Envoi...' : 'Envoyer le lien'}
          </button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          <Link to="/login">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}
