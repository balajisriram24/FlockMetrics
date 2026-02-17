/**
 * About Page
 */
export default function About() {
  return (
    <div className="container">
      <h1 style={{ marginBottom: 24 }}>About Smart Livestock Farm</h1>
      <div className="card">
        <p>
          Smart Livestock / Poultry Farm Management System helps farmers track animals,
          monitor health, record sales, and view reports in one place.
        </p>
        <p style={{ marginTop: 16 }}>
          <strong>Features:</strong> Dashboard, Live Feed simulation, Tag scanning,
          Farm management (add/edit animals), Sales tracking, Profit & Loss, Reports.
        </p>
        <p style={{ marginTop: 16 }}>
          <strong>Tech:</strong> React (Vite) + Flask + MongoDB
        </p>
      </div>
    </div>
  )
}
