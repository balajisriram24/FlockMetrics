/**
 * Scan Tag - Input tag ID and fetch animal from backend
 */
import { useState } from 'react'
import { getAnimalByTag } from '../api'

export default function ScanTag() {
  const [tagId, setTagId] = useState('')
  const [animal, setAnimal] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')
    setAnimal(null)
    if (!tagId.trim()) return
    setLoading(true)
    try {
      const data = await getAnimalByTag(tagId.trim())
      setAnimal(data)
    } catch (err) {
      setError(err.message || 'Animal not found')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: 24 }}>Scan Tag</h1>
      <div className="card" style={{ maxWidth: 500 }}>
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label>Tag ID</label>
            <input
              type="text"
              value={tagId}
              onChange={(e) => setTagId(e.target.value)}
              placeholder="e.g. CHICK-001"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        {error && <p className="error" style={{ marginTop: 12 }}>{error}</p>}
      </div>
      {animal && (
        <div className="card" style={{ maxWidth: 500, marginTop: 20 }}>
          <h3>Animal Details</h3>
          <table>
            <tbody>
              <tr><td><strong>Tag ID</strong></td><td>{animal.tag_id}</td></tr>
              <tr><td><strong>Species</strong></td><td>{animal.species}</td></tr>
              <tr><td><strong>Breed</strong></td><td>{animal.breed}</td></tr>
              <tr><td><strong>Age (months)</strong></td><td>{animal.age_months}</td></tr>
              <tr><td><strong>Weight (kg)</strong></td><td>{animal.weight_kg}</td></tr>
              <tr><td><strong>Health</strong></td><td>{animal.health_status}</td></tr>
              <tr><td><strong>Temperature (°C)</strong></td><td>{animal.temperature}</td></tr>
              <tr><td><strong>Notes</strong></td><td>{animal.notes || '-'}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
