/**
 * Live Feed - Simulated camera view with temperature and tag display
 */
import { useState, useEffect } from 'react'
import { getAnimals } from '../api'

export default function LiveFeed() {
  const [animals, setAnimals] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnimals()
      .then(setAnimals)
      .catch(() => setAnimals([]))
      .finally(() => setLoading(false))
  }, [])

  // Set first animal when loaded
  useEffect(() => {
    if (animals.length > 0 && !selected) setSelected(animals[0])
  }, [animals])

  // Auto-rotate every 3 seconds
  useEffect(() => {
    if (animals.length === 0) return
    const t = setInterval(() => {
      setSelected((prev) => {
        const idx = prev ? animals.findIndex(a => a._id === prev._id) + 1 : 0
        return animals[idx % animals.length]
      })
    }, 3000)
    return () => clearInterval(t)
  }, [animals])

  if (loading) return <div className="container"><p>Loading...</p></div>

  return (
    <div className="container">
      <h1 style={{ marginBottom: 24 }}>Live Feed</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>📹 Simulated Camera View</h3>
          <div style={{
            background: 'linear-gradient(180deg, #8d6e63 0%, #5d4037 100%)',
            height: 400,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'black',
            fontSize: 48,
            position: 'relative'
          }}>
            {selected ? (
              <>
                <span>🐔</span>
                <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ background: 'rgba(255, 255, 255, 1)', padding: '8px 12px', borderRadius: 6 }}>
                    Tag: {selected.tag_id}
                  </span>
                  <span style={{ background: 'rgb(255, 255, 255)', padding: '8px 12px', borderRadius: 6 }}>
                    🌡️ {selected.temperature || 40}°C
                  </span>
                </div>
              </>
            ) : (
              <span>No animals in farm</span>
            )}
          </div>
          <p style={{ marginTop: 12, color: '#888', fontSize: 13 }}>Auto-rotating every 3 seconds</p>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Current View</h3>
          {selected ? (
            <div>
              <p><strong>Tag:</strong> {selected.tag_id}</p>
              <p><strong>Species:</strong> {selected.species}</p>
              <p><strong>Breed:</strong> {selected.breed}</p>
              <p><strong>Temperature:</strong> {selected.temperature || 40}°C</p>
              <p><strong>Health:</strong> {selected.health_status}</p>
            </div>
          ) : (
            <p>No animal selected</p>
          )}
        </div>
      </div>
    </div>
  )
}
