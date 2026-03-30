import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/apiFetch';

interface User {
  id: string;
  email: string;
  role: string;
  state: number;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  async function loadUsers() {
    const res = await apiFetch('/api/users');
    setUsers(await res.json());
  }

  useEffect(() => { loadUsers(); }, []);

  async function toggleRole(user: User) {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await apiFetch(`/api/users/${user.id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role: newRole }),
    });
    loadUsers();
  }

  async function toggleState(user: User) {
    const newState = user.state === 1 ? 0 : 1;
    await apiFetch(`/api/users/${user.id}/state`, {
      method: 'PATCH',
      body: JSON.stringify({ state: newState }),
    });
    loadUsers();
  }

  return (
    <div className="page">
      <h1>Utilisateurs</h1>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Rôle</th>
            <th>État</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.state === 1 ? 'Actif' : 'Désactivé'}</td>
              <td className="actions">
                <button onClick={() => toggleRole(u)}>
                  {u.role === 'admin' ? 'Passer user' : 'Passer admin'}
                </button>
                <button className={u.state === 1 ? 'danger' : 'primary'} onClick={() => toggleState(u)}>
                  {u.state === 1 ? 'Désactiver' : 'Activer'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
