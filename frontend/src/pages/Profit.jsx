/**
 * Profit & Loss - Shows data from backend
 */
import { useState, useEffect } from 'react'
import { getProfit } from '../api'

export default function Profit() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getProfit()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="container"><p>Loading...</p></div>
  if (error) return <div className="container"><p className="error">{error}</p></div>
  if (!data) return null

  return (
    <div className="container">
      <h1 style={{ marginBottom: 24 }}>Profit & Loss</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        <div className="card" style={{ borderLeft: '4px solid #2e7d32' }}>
          <p style={{ color: '#888', fontSize: 14 }}>Sales Total</p>
          <p style={{ fontSize: 24, fontWeight: 700 }}>${data.sales_total?.toFixed(2)}</p>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #c62828' }}>
          <p style={{ color: '#888', fontSize: 14 }}>Costs Total</p>
          <p style={{ fontSize: 24, fontWeight: 700 }}>${data.costs_total?.toFixed(2)}</p>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #1565c0' }}>
          <p style={{ color: '#888', fontSize: 14 }}>Net Profit</p>
          <p style={{ fontSize: 24, fontWeight: 700 }}>${data.profit?.toFixed(2)}</p>
        </div>
      </div>
      <p style={{ marginTop: 24, color: '#888' }}>Costs can be added in future updates.</p>
    </div>
  )
}
