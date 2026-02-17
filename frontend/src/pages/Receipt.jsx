import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const SUB_KEY = 'subscriptions'

export default function Receipt() {
  const { txId } = useParams()
  const [receipt, setReceipt] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const raw = localStorage.getItem(SUB_KEY)
    if (!raw) return
    const subs = JSON.parse(raw)
    for (const s of subs) {
      if (s.receipt && s.receipt.txId === txId) {
        setReceipt(s.receipt)
        return
      }
    }
  }, [txId])

  if (!receipt) return (
    <div className="container">
      <h1>Receipt</h1>
      <div className="card"><p>Receipt not found.</p></div>
    </div>
  )

  return (
    <div className="container">
      <h1>Payment Receipt</h1>
      <div className="card">
        <h3>Receipt</h3>
        <p><strong>Transaction ID:</strong> {receipt.txId}</p>
        <p><strong>Timestamp:</strong> {receipt.timestamp}</p>
        <p><strong>Name:</strong> {receipt.name}</p>
        <p><strong>Email:</strong> {receipt.email}</p>
        <p><strong>Plan:</strong> {receipt.plan}</p>
        <p><strong>Method:</strong> {receipt.method}</p>
        <p><strong>Amount:</strong> {receipt.amount} Rs</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button className="btn btn-primary" onClick={() => window.print()} style={{ flex: 1 }}>Print</button>
          <button className="btn btn-secondary" onClick={() => {
            const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `receipt-${receipt.txId}.json`
            a.click()
            URL.revokeObjectURL(url)
          }} style={{ flex: 1 }}>Download</button>
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn btn-primary" onClick={() => navigate('/subscription')}>Done</button>
        </div>
      </div>
    </div>
  )
}
