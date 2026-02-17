import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Profile() {
  const navigate = useNavigate()
  const user = localStorage.getItem('user')

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '20px' }}>
      <h1 style={{ color: '#2e7d32', marginBottom: '30px' }}>👤 User Profile</h1>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            background: '#2e7d32',
            color: 'white',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '60px',
            margin: '0 auto 20px'
          }}>
            👤
          </div>
        </div>

        {/* Profile Info */}
        <div style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>Username</h3>
          <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>{user}</p>
        </div>

        <div style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>Role</h3>
          <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>Farm Manager</p>
        </div>

        <div style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>Account Status</h3>
          <p style={{ color: '#4caf50', fontSize: '16px', margin: 0 }}>✓ Active</p>
        </div>

        <div style={{ marginBottom: '30px', paddingBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>Member Since</h3>
          <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>{new Date().toLocaleDateString()}</p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
          <button
            onClick={() => navigate('/settings')}
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
            ⚙️ Go to Settings
          </button>
          <button
            onClick={() => navigate('/')}
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
            ← Back Home
          </button>
        </div>
      </div>
    </div>
  )
}
