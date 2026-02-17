/**
 * Smart Livestock Farm - Main App with Routing
 * All pages accessible without login
 */
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import LiveFeed from './pages/LiveFeed'
import ScanTag from './pages/ScanTag'
import Farm from './pages/Farm'
import Sales from './pages/Sales'
import Profit from './pages/Profit'
import Reports from './pages/Reports'
import About from './pages/About'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import DailyTemperature from './pages/DailyTemperature'
import Feed from './pages/Feed'
import WaterUsage from './pages/WaterUsage'
import Vaccination from './pages/Vaccination'
import Production from './pages/Production'
import Subscription from './pages/Subscription'
import Payment from './pages/Payment'
import Receipt from './pages/Receipt'

export default function App() {
  const location = useLocation()
  const showNavbar = !['/login', '/register'].includes(location.pathname)

  return (
    <>
      {showNavbar && <Navbar />}
      <main style={{ paddingTop: showNavbar ? 60 : 0 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/live-feed" element={<LiveFeed />} />
          <Route path="/scan-tag" element={<ScanTag />} />
          <Route path="/farm" element={<Farm />} />
          <Route path="/daily-temperature" element={<DailyTemperature />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/water" element={<WaterUsage />} />
          <Route path="/vaccination" element={<Vaccination />} />
          <Route path="/production" element={<Production />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/receipt/:txId" element={<Receipt />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/profit" element={<Profit />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </>
  )
}
