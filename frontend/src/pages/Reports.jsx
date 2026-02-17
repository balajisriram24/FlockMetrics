/**
 * Reports - Aggregated farm data
 */
import { useState, useEffect } from 'react'
import { getReports } from '../api'

export default function Reports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getReports()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="container"><p>Loading reports...</p></div>
  if (error) return <div className="container"><p className="error">{error}</p></div>
  if (!data) return null

  return (
    <div className="container">
      <h1 style={{ marginBottom: 24 }}>Reports</h1>
      <div style={{ display: 'grid', gap: 24 }}>
        <div className="card">
          <h3>Summary</h3>
          <p>Total Animals: <strong>{data.total_animals}</strong></p>
          <p>Total Sales Records: <strong>{data.total_sales_count}</strong></p>
          <p>Sales Total Amount: <strong>${data.sales_total_amount?.toFixed(2)}</strong></p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="card">
            <h3>Species Breakdown</h3>
            {data.species_breakdown?.length ? (
              <table>
                <thead>
                  <tr><th>Species</th><th>Count</th></tr>
                </thead>
                <tbody>
                  {data.species_breakdown.map((s) => (
                    <tr key={s._id}><td>{s._id}</td><td>{s.count}</td></tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No data</p>
            )}
          </div>
          <div className="card">
            <h3>Health Breakdown</h3>
            {data.health_breakdown?.length ? (
              <table>
                <thead>
                  <tr><th>Status</th><th>Count</th></tr>
                </thead>
                <tbody>
                  {data.health_breakdown.map((h) => (
                    <tr key={h._id}><td>{h._id}</td><td>{h.count}</td></tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
