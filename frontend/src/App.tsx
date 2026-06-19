import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, Outlet, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Articles from './pages/Articles';
import Exercises from './pages/Exercises';
import Users from './pages/Users';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function Nav({ onLogout }: { onLogout: () => void }) {
  return (
    <nav>
      <strong>CesiZen Backoffice avec une erreur</strong>
      <Link to="/articles">Articles</Link>
      <Link to="/exercises">Exercices</Link>
      <Link to="/users">Utilisateurs</Link>
      <button onClick={onLogout} style={{ marginLeft: 'auto' }}>Déconnexion</button>
    </nav>
  );
}

function ProtectedLayout({ isLoggedIn, onLogout }: { isLoggedIn: boolean; onLogout: () => void }) {
  if (!isLoggedIn) return <Navigate to="/login" />;
  return (
    <>
      <Nav onLogout={onLogout} />
      <Outlet />
    </>
  );
}

function LoginWrapper({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();
  function handleLogin(token: string) {
    localStorage.setItem('token', token);
    onLogin();
    navigate('/articles');
  }
  return <Login onLogin={handleLogin} />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  function handleLogout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Pages publiques sans header */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/articles" /> : <LoginWrapper onLogin={() => setIsLoggedIn(true)} />} />

        {/* Backoffice avec header */}
        <Route element={<ProtectedLayout isLoggedIn={isLoggedIn} onLogout={handleLogout} />}>
          <Route path="/articles" element={<Articles />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/users" element={<Users />} />
        </Route>

        <Route path="*" element={<Navigate to="/articles" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
