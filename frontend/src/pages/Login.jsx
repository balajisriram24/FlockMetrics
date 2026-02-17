/**
 * Login Page - Username/password login, redirects to Dashboard on success
 */
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(username, password)
      if (res.success) {
        localStorage.setItem('user', res.user.username)
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Login failed. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff'
    }}>
      <div className="card" style={{ maxWidth: 400, width: '100%', margin: 20 }}>
        <h1 style={{ marginBottom: 8, color: '#2e7d32' }}>Smart Livestock Farm</h1>
        <p style={{ marginBottom: 24, color: '#999' }}>Sign in to manage your farm</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ marginTop: 16, fontSize: 13, color: '#999' }}>
          Default: admin / 1234
        </p>
        <Link to="/register" style={{ display: 'block', marginTop: 12, color: '#2e7d32' }}>Don&apos;t have an account? Register</Link>
        <Link to="/" style={{ display: 'block', marginTop: 8, color: '#2e7d32' }}>← Back to Home</Link>
      </div>
    </div>
  )
}
