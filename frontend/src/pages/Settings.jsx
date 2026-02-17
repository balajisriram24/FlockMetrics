import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Settings() {
  const navigate = useNavigate()
  const user = localStorage.getItem('user')
  const [email, setEmail] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [theme, setTheme] = useState('light')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const handleSave = () => {
    setMessage('Settings saved successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '20px' }}>
      <h1 style={{ color: '#2e7d32', marginBottom: '30px' }}>⚙️ Settings</h1>

      {message && (
        <div style={{
          background: '#4caf50',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {message}
        </div>
      )}

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* Account Settings */}
        <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
          <h3 style={{ color: '#2e7d32', marginBottom: '16px' }}>Account Settings</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#333', fontWeight: '600', marginBottom: '8px' }}>
              Username
            </label>
            <input
              type="text"
              value={user}
              disabled
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: '#f5f5f5',
                color: '#999'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#333', fontWeight: '600', marginBottom: '8px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={() => navigate('/settings/change-password')}
            style={{
              background: '#ff9800',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔒 Change Password
          </button>
        </div>

        {/* Preferences */}
        <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
          <h3 style={{ color: '#2e7d32', marginBottom: '16px' }}>Preferences</h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ color: '#333' }}>📬 Enable Notifications</span>
            </label>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#333', fontWeight: '600', marginBottom: '8px' }}>
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="light">☀️ Light Mode</option>
              <option value="dark">🌙 Dark Mode</option>
              <option value="auto">🔄 Auto (System)</option>
            </select>
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{ marginBottom: '20px', padding: '16px', background: '#ffebee', borderRadius: '4px', border: '1px solid #ffcdd2' }}>
          <h3 style={{ color: '#d32f2f', margin: '0 0 12px 0' }}>⚠️ Danger Zone</h3>
          <button
            onClick={() => {
              if (window.confirm('Are you sure? This action cannot be undone.')) {
                localStorage.removeItem('user')
                navigate('/login')
              }
            }}
            style={{
              background: '#d32f2f',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🗑️ Delete Account
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
          <button
            onClick={handleSave}
            style={{
              background: '#2e7d32',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            ✓ Save Changes
          </button>
          <button
            onClick={() => navigate('/profile')}
            style={{
              background: '#f0f0f0',
              color: '#333',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Back to Profile
          </button>
        </div>
      </div>
    </div>
  )
}
