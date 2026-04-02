import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/apiFetch';

interface Article {
  id: string;
  title: string;
  content: string;
  imgUrl?: string;
  status: number;
  readingTime: number;
}

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState({ title: '', content: '', imgUrl: '', status: 1, readingTime: 5 });
  const [imageFile, setImageFile] = useState<File | null>(null);

  async function loadArticles() {
    const res = await apiFetch('/api/articles');
    setArticles(await res.json());
  }

  useEffect(() => { loadArticles(); }, []);

  function resetForm() {
    setForm({ title: '', content: '', imgUrl: '', status: 1, readingTime: 5 });
    setEditing(null);
  }

  function startEdit(a: Article) {
    setEditing(a);
    setForm({ title: a.title, content: a.content, imgUrl: a.imgUrl || '', status: a.status, readingTime: a.readingTime });
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('status', String(form.status));
    formData.append('readingTime', String(form.readingTime));
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (form.imgUrl) {
      formData.append('imgUrl', form.imgUrl);
    }
    if (editing) {
      await apiFetch(`/api/articles/${editing.id}`, { method: 'PUT', body: formData });
    } else {
      await apiFetch('/api/articles', { method: 'POST', body: formData });
    }
    resetForm();
    setImageFile(null);
    loadArticles();
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet article ?')) return;
    await apiFetch(`/api/articles/${id}`, { method: 'DELETE' });
    loadArticles();
  }

  return (
    <div className="page">
      <h1>Articles</h1>
      <form onSubmit={handleSubmit} className="form-card">
        <h3>{editing ? 'Modifier' : 'Créer'} un article</h3>
        <div className="field">
          <label>Titre</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="field">
          <label>Contenu</label>
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
        </div>
        <div className="field">
          <label>Image (fichier)</label>
          <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
        </div>
        <div className="field">
          <label>ou Image URL (optionnel)</label>
          <input value={form.imgUrl} onChange={e => setForm({ ...form, imgUrl: e.target.value })} />
        </div>
        <div className="row">
          <div className="field" style={{ flex: 1 }}>
            <label>Status</label>
            <input type="number" value={form.status} onChange={e => setForm({ ...form, status: Number(e.target.value) })} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Temps de lecture (min)</label>
            <input type="number" value={form.readingTime} onChange={e => setForm({ ...form, readingTime: Number(e.target.value) })} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" className="primary">{editing ? 'Modifier' : 'Créer'}</button>
          {editing && <button type="button" onClick={resetForm}>Annuler</button>}
        </div>
      </form>

      <table>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Status</th>
            <th>Lecture</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map(a => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.status}</td>
              <td>{a.readingTime} min</td>
              <td className="actions">
                <button onClick={() => startEdit(a)}>Modifier</button>
                <button className="danger" onClick={() => handleDelete(a.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
