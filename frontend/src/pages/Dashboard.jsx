/**
 * Dashboard - Shows total animals, avg temp, unhealthy count, sales total, animal counts by species
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboard, getReports, getAnimals, getSales, getProfit } from '../api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [animalCounts, setAnimalCounts] = useState([])
  const [animals, setAnimals] = useState([])
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getDashboard(), getReports().catch(() => null), getAnimals().catch(() => []), getSales().catch(() => [])])
      .then(([dash, reports, animalsData, salesData]) => {
        setData(dash)
        setAnimals(animalsData || [])
        setSales(salesData || [])
        if (reports?.species_breakdown?.length) {
          setAnimalCounts(reports.species_breakdown)
        } else if (dash?.total_animals) {
          setAnimalCounts([{ _id: 'Total', count: dash.total_animals }])
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="container"><p>Loading dashboard...</p></div>
  if (error) return <div className="container"><p className="error">{error}</p></div>
  if (!data) return null

  const stats = [
    { label: 'Total Animals', value: data.total_animals, icon: '🐔', color: '#2e7d32' },
    { label: 'Avg Temperature (°C)', value: data.average_temperature, icon: '🌡️', color: '#1565c0' },
    { label: 'Unhealthy Count', value: data.unhealthy_count, icon: '⚠️', color: '#c62828' },
    { label: 'Sales Total ($)', value: data.sales_total.toFixed(2), icon: '💰', color: '#6a1b9a' }
  ]

  // Calculate stats for each feature
  const healthyCount = animals.filter(a => a.health_status === 'healthy').length
  const sickCount = animals.filter(a => a.health_status === 'sick' || a.health_status === 'unhealthy').length

  const menuItems = [
    { label: 'Live Feed', path: '/live-feed', icon: '📹', stat: animals.length, unit: 'Animals' },
    { label: 'Scan Tag', path: '/scan-tag', icon: '🏷️', stat: animals.length, unit: 'Tags' },
    { label: 'Farm Management', path: '/farm', icon: '🏠', stat: data.total_animals, unit: 'Total' },
    { label: 'Daily Temperature', path: '/daily-temperature', icon: '📊', stat: data.average_temperature, unit: '°C' },
    { label: 'Feed', path: '/feed', icon: '🌾', stat: animals.length, unit: 'Animals' },
    { label: 'Water Usage', path: '/water-usage', icon: '💧', stat: animals.length, unit: 'Animals' },
    { label: 'Vaccination', path: '/vaccination', icon: '💉', stat: healthyCount, unit: 'Healthy' },
    { label: 'Production', path: '/production', icon: '📈', stat: data.total_animals, unit: 'Animals' },
    { label: 'Profit', path: '/profit', icon: '💵', stat: data.sales_total.toFixed(2), unit: '$' },
    { label: 'Sales', path: '/sales', icon: '🛒', stat: sales.length, unit: 'Records' }
  ]

  return (
    <div className="container">
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {stats.map((s) => (
          <div key={s.label} className="card" style={{ borderLeft: `4px solid ${s.color}` }}>
            <p style={{ color: '#888', fontSize: 14 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{s.icon} {s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Access Menu */}
      <div style={{ marginTop: 32 }}>
        <h2 style={{ marginBottom: 16, color: 'black' }}>Quick Access</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
          {menuItems.map((item) => (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              className="card"
              style={{
                cursor: 'pointer',
                textAlign: 'center',
                padding: '20px',
                transition: 'all 0.3s ease',
                border: '1px solid #444'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2196F3'
                e.currentTarget.style.boxShadow = '0 0 10px rgba(33, 150, 243, 0.3)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#444'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <p style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#2196F3', marginBottom: 4 }}>{item.stat}</p>
              <p style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>{item.unit}</p>
              <p style={{ color: 'black', fontSize: 14, fontWeight: 500 }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Animal Counts by Species */}
      {animalCounts.length > 0 && (
        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 16, color: 'black' }}>Animal Counts by Species</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Species</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {animalCounts.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
