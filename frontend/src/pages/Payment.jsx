import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SUB_KEY = 'subscriptions'

export default function Payment() {
  const [pending, setPending] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [receipt, setReceipt] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const raw = localStorage.getItem('pending_payment')
    if (raw) setPending(JSON.parse(raw))
  }, [])

  const saveSubscription = (entry) => {
    const raw = localStorage.getItem(SUB_KEY)
    const list = raw ? JSON.parse(raw) : []
    const next = [entry, ...list]
    localStorage.setItem(SUB_KEY, JSON.stringify(next))
  }

  const handlePay = () => {
    if (!pending) return
    setProcessing(true)
    // Simulate payment delay
    setTimeout(() => {
      // mark as paid and save with receipt
      const txId = 'TX' + Math.random().toString(36).slice(2, 10).toUpperCase()
      const timestamp = new Date().toISOString()
      const receiptObj = {
        txId,
        timestamp,
        name: pending.name,
        email: pending.email,
        plan: pending.plan,
        method: pending.payment_method,
        amount: pending.amount,
      }
      const paid = { ...pending, paid: true, receipt: receiptObj }
      saveSubscription(paid)
      localStorage.removeItem('pending_payment')
      setProcessing(false)
      setReceipt(receiptObj)
    }, 1200)
  }

  const handleClear = () => {
    localStorage.removeItem('pending_payment')
    setPending(null)
    alert('Pending payment cleared')
  }

  if (!pending && !receipt) return (
    <div className="container">
      <h1>Payment</h1>
      <div className="card"><p>No pending payment. Start a premium subscription from the Subscriptions page.</p></div>
    </div>
  )

  // If receipt exists, show receipt UI
  if (receipt) return (
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

  return (
    <div className="container">
      <h1>Payment</h1>
      <div className="card">
        <h3>Pending Payment</h3>
        <p><strong>Name:</strong> {pending.name}</p>
        <p><strong>Email:</strong> {pending.email}</p>
        <p><strong>Plan:</strong> {pending.plan}</p>
        <p><strong>Method:</strong> {pending.payment_method}</p>
        <p><strong>Amount:</strong> {pending.amount} Rs</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button className="btn btn-primary" onClick={handlePay} disabled={processing} style={{ flex: 1 }}>{processing ? 'Processing...' : 'Pay'}</button>
          <button className="btn btn-secondary" onClick={handleClear} style={{ flex: 1 }}>Clear Payment</button>
        </div>
      </div>
    </div>
  )
}
