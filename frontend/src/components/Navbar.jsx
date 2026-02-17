/**
 * Navbar - Collapsible menu, closes when you click a link
 */
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  const user = localStorage.getItem('user')

  const handleLogout = () => {
    localStorage.removeItem('user')
    setMenuOpen(false)
    setProfileOpen(false)
    navigate('/login')
  }

  const closeMenu = () => setMenuOpen(false)
  const toggleProfile = (e) => {
    e.stopPropagation()
    setProfileOpen(!profileOpen)
  }

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen && !profileOpen) return
    const handleClick = () => {
      setMenuOpen(false)
      setProfileOpen(false)
    }
    setTimeout(() => document.addEventListener('click', handleClick), 0)
    return () => document.removeEventListener('click', handleClick)
  }, [menuOpen, profileOpen])

  const navLink = (to, label) => (
    <Link to={to} onClick={closeMenu} style={{ color: 'white', textDecoration: 'none', display: 'block', padding: '12px 16px' }}>
      {label}
    </Link>
  )

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: '#000',
      color: 'white',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      <Link to="/" onClick={closeMenu} style={{ color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 18 }}>
         Smart Livestock Farm
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {user ? (
          <>
            {/* User Profile Avatar */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={toggleProfile}
                style={{
                  background: '#1b5e20',
                  border: 'none',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                  position: 'relative'
                }}
                onMouseOver={(e) => e.target.style.background = '#145a1f'}
                onMouseOut={(e) => e.target.style.background = '#1b5e20'}
                title={`${user} (Click to view profile)`}
              >
                👤
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: 'white',
                    color: '#333',
                    minWidth: '240px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    borderRadius: '8px',
                    marginTop: '12px',
                    overflow: 'hidden',
                    zIndex: 1001
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Profile Header */}
                  <div style={{ padding: '16px', background: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        background: '#2e7d32',
                        color: 'white',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                      }}>
                        👤
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#333' }}>{user}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>Farm Manager</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div>
                    <button
                      onClick={() => {
                        setProfileOpen(false)
                        navigate('/profile')
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: '#333',
                        fontSize: '14px',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
                      onMouseOut={(e) => e.target.style.background = 'none'}
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        setProfileOpen(false)
                        navigate('/settings')
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: '#333',
                        fontSize: '14px',
                        transition: 'background 0.2s',
                        borderBottom: '1px solid #e0e0e0'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
                      onMouseOut={(e) => e.target.style.background = 'none'}
                    >
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: '#d32f2f',
                        fontSize: '14px',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#ffebee'}
                      onMouseOut={(e) => e.target.style.background = 'none'}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu} style={{ color: 'white', textDecoration: 'none', fontSize: 14 }}>Login</Link>
            <Link to="/register" onClick={closeMenu} style={{ color: 'white', textDecoration: 'none', fontSize: 14 }}>Register</Link>
          </>
        )}
        {/* Hamburger button */}
        <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: 24,
          cursor: 'pointer',
          padding: '4px 8px'
        }}
        aria-label="Toggle menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>
      </div>

      {/* Dropdown menu - only visible when menuOpen */}
      {menuOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: 56,
            right: 0,
            background: '#000',
            minWidth: 240,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            borderRadius: '0 0 0 8px',
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: '70vh',
            boxSizing: 'border-box',
            zIndex: 999,
            padding: 8
          }}
        >
          {/* subscription card removed per request */}

          {navLink('/', 'Home')}
          {navLink('/dashboard', 'Dashboard')}
          {navLink('/live-feed', 'Live Feed')}
          {navLink('/scan-tag', 'Scan Tag')}
          {navLink('/farm', 'Farm Management')}
          {navLink('/daily-temperature', 'Daily Temperature Record')}
          {navLink('/feed', 'Feed')}
          {navLink('/water', 'Water Usage')}
          {navLink('/vaccination', 'Vaccination & Medicine')}
          {navLink('/production', 'Production (Daily / Weekly)')}
          {navLink('/profit', 'Profit')}
          {navLink('/sales', 'Sales')}
          {navLink('/reports', 'Reports')}
          {navLink('/subscription', 'Subscription')}
          {navLink('/about', 'About')}
          {navLink('/contact', 'Contact')}
        </div>
      )}
    </nav>
  )
}
