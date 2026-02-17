/**
 * Home Page - Landing with heading, round graph, and stocks graph
 */
import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip } from 'recharts'
import { getDashboard, getReports } from '../api'

const PIE_COLORS = ['#2e7d32', '#1b5e20', '#66bb6a', '#81c784', '#a5d6a7']

export default function Home() {
  const [pieData, setPieData] = useState([
    { name: 'Chicken', value: 45, color: PIE_COLORS[0] },
    { name: 'Duck', value: 25, color: PIE_COLORS[1] },
    { name: 'Turkey', value: 15, color: PIE_COLORS[2] },
    { name: 'Goat', value: 10, color: PIE_COLORS[3] },
    { name: 'Cattle', value: 5, color: PIE_COLORS[4] }
  ])
  const [lineData, setLineData] = useState([
    { month: 'Jan', sales: 1200, animals: 80 },
    { month: 'Feb', sales: 1500, animals: 95 },
    { month: 'Mar', sales: 1800, animals: 110 },
    { month: 'Apr', sales: 2100, animals: 125 },
    { month: 'May', sales: 2400, animals: 140 },
    { month: 'Jun', sales: 2200, animals: 135 }
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getDashboard().catch(() => null), getReports().catch(() => null)])
      .then(([dash, reports]) => {
        if (reports?.species_breakdown?.length) {
          setPieData(reports.species_breakdown.map((s, i) => ({
            name: s._id || 'Unknown',
            value: s.count || 0,
            color: PIE_COLORS[i % PIE_COLORS.length]
          })))
        }
        if (dash) {
          setLineData(prev => prev.map((p, i) => ({
            ...p,
            sales: i === prev.length - 1 ? dash.sales_total : p.sales,
            animals: i === prev.length - 1 ? dash.total_animals : p.animals
          })))
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <h1 style={{ fontSize: 36, textAlign: 'center', color: '#2e7d32', marginBottom: 16 }}>Smart Livestock Farm</h1>
      <p style={{ textAlign: 'center', color: '#999', fontSize: 18, maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.6 }}>
        Manage your poultry and livestock with ease. Track animals, monitor health, record sales, and view real-time insights all in one place.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginTop: 40 }}>
        {/* Round (Donut) Graph - Species Distribution */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, color: '#000000' }}>Animal Distribution</h3>
          {loading ? (
            <p style={{ color: '#666' }}>Loading...</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #ddd', borderRadius: 6 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Stocks Graph - Sales & Animals Trend */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, color: '#fff9f9' }}>Sales & Stock Trend</h3>
          {loading ? (
            <p style={{ color: '#666' }}>Loading...</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <LineTooltip contentStyle={{ background: '#ffffff', border: '1px solid #ddd', borderRadius: 6 }} />
                <Line type="monotone" dataKey="sales" stroke="#2e7d32" strokeWidth={2} name="Sales ($)" />
                <Line type="monotone" dataKey="animals" stroke="#1565c0" strokeWidth={2} name="Animals" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* How-to / Quick guide */}
      <div style={{ marginTop: 32 }}>
        <div className="card" style={{ padding: 20, maxWidth: 960, margin: '0 auto', lineHeight: 1.6 }}>
          <h3 style={{ marginBottom: 12, color: '#000000' }}>How to use this app (quick guide)</h3>
          <ul style={{ color: '#000000', margin: 0, paddingLeft: 18 }}>
            <li><strong>Navigation:</strong> Use the top menu to open pages: <em>Dashboard</em>, <em>Live Feed</em>, <em>Scan Tag</em>, and the management pages.</li>
            <li><strong>Find an animal:</strong> Go to <em>Scan Tag</em> and enter a tag ID to view that animal's details.</li>
            <li><strong>Record daily data:</strong> Use <em>Daily Temperature Record</em>, <em>Feed</em>, <em>Water Usage</em>, <em>Vaccination & Medicine</em>, and <em>Production</em> to add entries — forms are on each page.</li>
            <li><strong>Sales & Profit:</strong> Add sales in <em>Sales</em>; view profit summaries in <em>Profit</em>.</li>
            <li><strong>Reports & Dashboard:</strong> Check <em>Reports</em> and <em>Dashboard</em> for summaries and charts of your data.</li>
            <li><strong>Quick tips:</strong> always set the correct date on forms; entries are stored locally unless a backend is connected; use consistent feed names and units (kg, liters) for accurate summaries.</li>
            <li><strong>Export / backup:</strong> If you run the backend, use the Reports page to export data (backend required).</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
