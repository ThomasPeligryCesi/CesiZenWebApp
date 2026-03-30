import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/apiFetch';

interface Exercise {
  id: string;
  name: string;
  imgUrl?: string;
  videoUrl?: string;
  duration: number;
  benefits?: string;
  level: number;
  description: string;
  steps: number[];
}

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [editing, setEditing] = useState<Exercise | null>(null);
  const [form, setForm] = useState({ name: '', imgUrl: '', videoUrl: '', duration: 60, benefits: '', level: 1, description: '', steps: '4,4,4' });

  async function loadExercises() {
    const res = await apiFetch('/api/exercises');
    setExercises(await res.json());
  }

  useEffect(() => { loadExercises(); }, []);

  function resetForm() {
    setForm({ name: '', imgUrl: '', videoUrl: '', duration: 60, benefits: '', level: 1, description: '', steps: '4,4,4' });
    setEditing(null);
  }

  function startEdit(ex: Exercise) {
    setEditing(ex);
    setForm({
      name: ex.name,
      imgUrl: ex.imgUrl || '',
      videoUrl: ex.videoUrl || '',
      duration: ex.duration,
      benefits: ex.benefits || '',
      level: ex.level,
      description: ex.description,
      steps: ex.steps.join(','),
    });
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = {
      name: form.name,
      duration: form.duration,
      level: form.level,
      description: form.description,
      steps: form.steps.split(',').map(Number),
      imgUrl: form.imgUrl || undefined,
      videoUrl: form.videoUrl || undefined,
      benefits: form.benefits || undefined,
    };
    if (editing) {
      await apiFetch(`/api/exercises/${editing.id}`, { method: 'PUT', body: JSON.stringify(body) });
    } else {
      await apiFetch('/api/exercises', { method: 'POST', body: JSON.stringify(body) });
    }
    resetForm();
    loadExercises();
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet exercice ?')) return;
    await apiFetch(`/api/exercises/${id}`, { method: 'DELETE' });
    loadExercises();
  }

  return (
    <div className="page">
      <h1>Exercices de respiration</h1>
      <form onSubmit={handleSubmit} className="form-card">
        <h3>{editing ? 'Modifier' : 'Créer'} un exercice</h3>
        <div className="field">
          <label>Nom</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
        </div>
        <div className="row">
          <div className="field" style={{ flex: 1 }}>
            <label>Durée (secondes)</label>
            <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Niveau</label>
            <input type="number" value={form.level} onChange={e => setForm({ ...form, level: Number(e.target.value) })} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Steps (inspi,maintien,expi)</label>
            <input value={form.steps} onChange={e => setForm({ ...form, steps: e.target.value })} placeholder="4,4,4" />
          </div>
        </div>
        <div className="field">
          <label>Bienfaits (optionnel)</label>
          <input value={form.benefits} onChange={e => setForm({ ...form, benefits: e.target.value })} />
        </div>
        <div className="row">
          <div className="field" style={{ flex: 1 }}>
            <label>Image URL (optionnel)</label>
            <input value={form.imgUrl} onChange={e => setForm({ ...form, imgUrl: e.target.value })} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Vidéo URL (optionnel)</label>
            <input value={form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })} />
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
            <th>Nom</th>
            <th>Niveau</th>
            <th>Durée</th>
            <th>Steps</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map(ex => (
            <tr key={ex.id}>
              <td>{ex.name}</td>
              <td>{ex.level}</td>
              <td>{ex.duration}s</td>
              <td>{ex.steps.join('-')}</td>
              <td className="actions">
                <button onClick={() => startEdit(ex)}>Modifier</button>
                <button className="danger" onClick={() => handleDelete(ex.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
