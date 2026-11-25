
import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = 'http://127.0.0.1:8000'

function App() {
  const [vehicles, setVehicles] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)

  async function loadFleet() {
    try {
      setError('')
      const [vehicleResponse, summaryResponse] = await Promise.all([
        fetch(`${API_URL}/api/vehicles`),
        fetch(`${API_URL}/api/summary`)
      ])

      if (!vehicleResponse.ok || !summaryResponse.ok) {
        throw new Error('Backend returned an unsuccessful response.')
      }

      const vehicleData = await vehicleResponse.json()
      const summaryData = await summaryResponse.json()

      setVehicles(vehicleData.vehicles || [])
      setSummary(summaryData)
      setLastUpdated(new Date())
    } catch (err) {
      setError('Cannot connect to the backend. Check that FastAPI is running on port 8000.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFleet()
    const interval = setInterval(loadFleet, 10000)
    return () => clearInterval(interval)
  }, [])

  const filteredVehicles = useMemo(() => {
    const query = search.toLowerCase()
    return vehicles.filter(vehicle =>
      `${vehicle.id} ${vehicle.driver} ${vehicle.type} ${vehicle.status}`
        .toLowerCase()
        .includes(query)
    )
  }, [vehicles, search])

  const moving = summary?.moving ?? 0
  const idle = summary?.idle ?? 0
  const alerts = summary?.alerts ?? 0
  const total = summary?.total_vehicles ?? vehicles.length

  const positions = [
    { left: '18%', top: '28%' },
    { left: '69%', top: '19%' },
    { left: '43%', top: '54%' },
    { left: '78%', top: '70%' },
    { left: '26%', top: '77%' }
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-symbol">N</div>
          <div>
            <h2>NEXMOTION<span> AI</span></h2>
            <small>MOBILITY INTELLIGENCE</small>
          </div>
        </div>

        <div className="side-label">WORKSPACE</div>
        <nav className="navigation">
          <a className="nav-item active" href="#overview"><span>▦</span> Overview</a>
          <a className="nav-item" href="#fleet"><span>▣</span> Fleet management</a>
          <a className="nav-item" href="#locations"><span>⌖</span> Live tracking</a>
          <a className="nav-item" href="#analytics"><span>▥</span> Analytics</a>
          <a className="nav-item" href="#alerts"><span>♧</span> Alerts</a>
        </nav>

        <div className="side-label system-label">SYSTEM</div>
        <nav className="navigation">
          <a className="nav-item" href="#maintenance"><span>⚙</span> Maintenance</a>
          <a className="nav-item" href="#settings"><span>☷</span> Settings</a>
        </nav>

        <div className="sidebar-bottom">
          <div className="system-card">
            <div className="system-card-top">
              <span className="online-dot"></span>
              <strong>System status</strong>
            </div>
            <p>{error ? 'Backend disconnected' : 'Monitoring active'}</p>
            <small>Development environment</small>
          </div>
          <div className="profile">
            <div className="avatar">NX</div>
            <div><strong>Fleet Operator</strong><small>Administrator</small></div>
            <span className="profile-menu">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> Overview</div>
          <div className="topbar-right">
            <span className="environment">● DEMO ENVIRONMENT</span>
            <button className="icon-button" onClick={loadFleet} title="Refresh data">↻</button>
            <div className="top-avatar">FO</div>
          </div>
        </header>

        <section className="page-heading">
          <div>
            <div className="eyebrow">MOBILITY COMMAND CENTER</div>
            <h1>Fleet Overview</h1>
            <p>Monitor your mobility operations, vehicles and fleet performance.</p>
          </div>
          <button className="refresh-button" onClick={loadFleet}>↻ &nbsp; Refresh data</button>
        </section>

        {error && (
          <div className="error-banner">
            <span>⚠</span> {error}
            <button onClick={loadFleet}>Retry</button>
          </div>
        )}

        <section className="metrics-grid">
          <MetricCard label="Total vehicles" value={loading ? '—' : total} detail="Registered in fleet" icon="▣" color="blue"/>
          <MetricCard label="Vehicles moving" value={loading ? '—' : moving} detail="Currently in transit" icon="➤" color="green"/>
          <MetricCard label="Idle vehicles" value={loading ? '—' : idle} detail="Not currently moving" icon="Ⅱ" color="purple"/>
          <MetricCard label="Active alerts" value={loading ? '—' : alerts} detail="Require attention" icon="⚠" color="orange"/>
        </section>

        <section className="content-grid">
          <div className="panel map-panel" id="locations">
            <div className="panel-heading">
              <div>
                <h3>Fleet location overview</h3>
                <p>Illustrative vehicle positions · Gwalior demo coordinates</p>
              </div>
              <span className="live-label"><i></i> SIMULATED</span>
            </div>

            <div className="map-area">
              <div className="map-road road-one"></div>
              <div className="map-road road-two"></div>
              <div className="map-road road-three"></div>
              <div className="map-road road-four"></div>
              <div className="map-road road-five"></div>
              <div className="map-road road-six"></div>
              <div className="map-block block-one"></div>
              <div className="map-block block-two"></div>
              <div className="map-block block-three"></div>
              <div className="map-block block-four"></div>
              <div className="map-block block-five"></div>
              <div className="map-block block-six"></div>
              <span className="map-location location-one">GWALIOR</span>
              <span className="map-location location-two">CITY CENTRE</span>

              {vehicles.map((vehicle, index) => (
                <div
                  key={vehicle.id}
                  className={`map-marker ${vehicle.status.toLowerCase()}`}
                  style={positions[index] || { left: '50%', top: '50%' }}
                  title={`${vehicle.id} · ${vehicle.driver} · ${vehicle.status}`}
                >
                  <span>▣</span>
                </div>
              ))}

              {vehicles.length === 0 && !loading && (
                <div className="map-empty">Vehicle positions will appear here.</div>
              )}

              <div className="map-attribution">DEMO MAP · NOT REAL-TIME GPS</div>
            </div>

            <div className="map-legend">
              <span><i className="legend-dot moving-dot"></i> Moving</span>
              <span><i className="legend-dot idle-dot"></i> Idle</span>
              <span><i className="legend-dot alert-dot"></i> Alert</span>
            </div>
          </div>

          <div className="panel health-panel" id="alerts">
            <div className="panel-heading">
              <div><h3>Fleet health</h3><p>Current operational status</p></div>
              <span className="health-icon">⌁</span>
            </div>

            <div className="health-total">
              <strong>{loading ? '—' : total}</strong>
              <span>Total vehicles monitored</span>
            </div>

            <div className="health-bar">
              <div className="bar-moving" style={{ width: `${total ? moving / total * 100 : 0}%` }}></div>
              <div className="bar-idle" style={{ width: `${total ? idle / total * 100 : 0}%` }}></div>
              <div className="bar-alert" style={{ width: `${total ? alerts / total * 100 : 0}%` }}></div>
            </div>

            <div className="health-row"><span><i className="legend-dot moving-dot"></i> Moving</span><strong>{moving}</strong></div>
            <div className="health-row"><span><i className="legend-dot idle-dot"></i> Idle</span><strong>{idle}</strong></div>
            <div className="health-row"><span><i className="legend-dot alert-dot"></i> Needs attention</span><strong>{alerts}</strong></div>

            <div className="health-note">
              <span>ⓘ</span>
              Vehicle telemetry currently uses demonstration data. Real GPS integration will be added later.
            </div>
          </div>
        </section>

        <section className="panel fleet-panel" id="fleet">
          <div className="fleet-heading">
            <div><h3>Vehicle directory</h3><p>Monitor and review your registered fleet</p></div>
            <div className="fleet-actions">
              <div className="search-box"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vehicles..." /></div>
              <button className="table-refresh" onClick={loadFleet}>↻</button>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>VEHICLE ID</th><th>DRIVER</th><th>VEHICLE TYPE</th><th>SPEED</th><th>FUEL / BATTERY</th><th>STATUS</th>
              </tr></thead>
              <tbody>
                {loading && <tr><td colSpan="6" className="table-message">Loading fleet data...</td></tr>}
                {!loading && filteredVehicles.map(vehicle => (
                  <tr key={vehicle.id}>
                    <td><strong className="vehicle-id">{vehicle.id}</strong></td>
                    <td><div className="driver-cell"><span className="driver-avatar">{vehicle.driver?.split(' ').map(n => n[0]).join('').slice(0,2)}</span>{vehicle.driver}</div></td>
                    <td>{vehicle.type}</td>
                    <td><strong>{vehicle.speed}</strong> <span className="muted">km/h</span></td>
                    <td>
                      <div className="fuel-cell">
                        <div className="fuel-track"><div style={{ width: `${vehicle.fuel}%` }}></div></div>
                        <span>{vehicle.fuel}%</span>
                      </div>
                    </td>
                    <td><StatusPill status={vehicle.status}/></td>
                  </tr>
                ))}
                {!loading && filteredVehicles.length === 0 && (
                  <tr><td colSpan="6" className="table-message">No matching vehicles found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <span>Showing {filteredVehicles.length} of {total} vehicles</span>
            <span>Source: {error ? 'Unavailable' : 'FastAPI · Simulated data'}</span>
          </div>
        </section>

        <footer className="footer">
          <span>© 2026 NEXMOTION AI · Moving Beyond Mobility</span>
          <span>{lastUpdated ? `Last synced ${lastUpdated.toLocaleTimeString()}` : 'Waiting for data'} · Auto refresh: 10 sec</span>
        </footer>
      </main>
    </div>
  )
}

function MetricCard({ label, value, detail, icon, color }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${color}`}>{icon}</div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-detail">{detail}</div>
    </div>
  )
}

function StatusPill({ status }) {
  return <span className={`status-pill ${status.toLowerCase()}`}><i></i>{status}</span>
}

export default App
