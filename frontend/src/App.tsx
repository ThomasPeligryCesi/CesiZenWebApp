import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Articles from './pages/Articles';
import Exercises from './pages/Exercises';
import Users from './pages/Users';

function Nav({ isLoggedIn, onLogout }: { isLoggedIn: boolean; onLogout: () => void }) {
  if (!isLoggedIn) return null;
  return (
    <nav>
      <strong>CesiZen Backoffice</strong>
      <Link to="/articles">Articles</Link>
      <Link to="/exercises">Exercices</Link>
      <Link to="/users">Utilisateurs</Link>
      <button onClick={onLogout} style={{ marginLeft: 'auto' }}>Déconnexion</button>
    </nav>
  );
}

function ProtectedRoute({ isLoggedIn, children }: { isLoggedIn: boolean; children: React.ReactNode }) {
  if (!isLoggedIn) return <Navigate to="/login" />;
  return <>{children}</>;
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
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  }

  return (
    <BrowserRouter>
      <Nav isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/articles" /> : <LoginWrapper onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/articles" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Articles /></ProtectedRoute>} />
        <Route path="/exercises" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Exercises /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Users /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/articles" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
