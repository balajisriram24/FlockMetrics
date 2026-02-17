/**
 * Farm Management - Add, list, and update animals
 */
import { useState, useEffect } from 'react'
import { getAnimals, addAnimal, updateAnimal } from '../api'

export default function Farm() {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    tag_id: '',
    species: 'Chicken',
    breed: '',
    age_months: 0,
    weight_kg: 0,
    health_status: 'healthy',
    temperature: 40,
    notes: ''
  })

  const loadAnimals = () => {
    getAnimals()
      .then(setAnimals)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(loadAnimals, [])

  const resetForm = () => {
    setForm({
      tag_id: '',
      species: 'Chicken',
      breed: '',
      age_months: 0,
      weight_kg: 0,
      health_status: 'healthy',
      temperature: 40,
      notes: ''
    })
    setEditing(null)
  }

  const handleEdit = (animal) => {
    setForm({
      tag_id: animal.tag_id,
      species: animal.species || 'Chicken',
      breed: animal.breed || '',
      age_months: animal.age_months || 0,
      weight_kg: animal.weight_kg || 0,
      health_status: animal.health_status || 'healthy',
      temperature: animal.temperature || 40,
      notes: animal.notes || ''
    })
    setEditing(animal._id)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      if (editing) {
        await updateAnimal(editing, form)
        setSuccess('Animal updated!')
      } else {
        await addAnimal(form)
        setSuccess('Animal added!')
      }
      resetForm()
      loadAnimals()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: 24 }}>Farm Management</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>{editing ? 'Edit Animal' : 'Add Animal'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tag ID *</label>
              <input
                value={form.tag_id}
                onChange={(e) => setForm({ ...form, tag_id: e.target.value })}
                required
                disabled={!!editing}
              />
            </div>
            <div className="form-group">
              <label>Species</label>
              <select
                value={form.species}
                onChange={(e) => setForm({ ...form, species: e.target.value })}
              >
                <option>Chicken</option>
                <option>Duck</option>
                <option>Turkey</option>
                <option>Goat</option>
                <option>Cattle</option>
              </select>
            </div>
            <div className="form-group">
              <label>Breed</label>
              <input
                value={form.breed}
                onChange={(e) => setForm({ ...form, breed: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Age (months)</label>
              <input
                type="number"
                value={form.age_months}
                onChange={(e) => setForm({ ...form, age_months: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.weight_kg}
                onChange={(e) => setForm({ ...form, weight_kg: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="form-group">
              <label>Health Status</label>
              <select
                value={form.health_status}
                onChange={(e) => setForm({ ...form, health_status: e.target.value })}
              >
                <option>healthy</option>
                <option>unhealthy</option>
                <option>sick</option>
                <option>critical</option>
              </select>
            </div>
            <div className="form-group">
              <label>Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: parseFloat(e.target.value) || 40 })}
              />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
              />
            </div>
            <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'}</button>
            {editing && (
              <button type="button" className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={resetForm}>
                Cancel
              </button>
            )}
          </form>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>All Animals</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Tag</th>
                    <th>Species</th>
                    <th>Breed</th>
                    <th>Health</th>
                    <th>Temp</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {animals.map((a) => (
                    <tr key={a._id}>
                      <td>{a.tag_id}</td>
                      <td>{a.species}</td>
                      <td>{a.breed}</td>
                      <td>{a.health_status}</td>
                      <td>{a.temperature}°C</td>
                      <td>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={() => handleEdit(a)}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {animals.length === 0 && <p style={{ padding: 20 }}>No animals yet. Add one!</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
