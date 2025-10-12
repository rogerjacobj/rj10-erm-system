import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import './tickets.css'
import './dashboard.css'

const HrDashboard = () => {
  const [ticketsByUser, setTicketsByUser] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('/api/all-tickets', { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      .then((r) => { if (!r.ok) throw new Error(`Status ${r.status}`); return r.json() })
      .then((json) => setTicketsByUser(json.ticketsByUser || {}))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  const updateStatus = async (ticketId, newStatus) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`/api/employee-tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const json = await res.json()
      // update local state and mark updated for highlight
      setTicketsByUser((prev) => {
        const next = { ...prev }
        for (const u in next) {
          next[u] = next[u].map(t => t.id === ticketId ? { ...json.ticket, _transient: 'updated' } : t)
        }
        return next
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <Navbar />
      <main className="page-container">
        <div className="header-row">
          <h1>HR Dashboard</h1>
          <div>
            <button onClick={logout}>Logout</button>
          </div>
        </div>

        {loading && <div>Loading…</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}

        <div className="main-grid">
          <div>
            <div className="card">
              <h3>All complaint tickets</h3>
              {Object.keys(ticketsByUser).length === 0 && <div className="small">No tickets</div>}
              {Object.entries(ticketsByUser).map(([user, list]) => (
                <div key={user} className="user-block">
                  <h4>{user}</h4>
                  <div className="ticket-list">
                    {list.map(t => (
                          <div key={t.id} className={`ticket ${t._transient === 'updated' ? 'updated' : ''}`}>
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                              <div className="title">{t.title} <span className="small">({t.category})</span></div>
                              <div><span className={`badge ${t.status.replace(/\s+/g,'-')}`}>{t.status}</span></div>
                            </div>
                            <div className="meta">{t.status} — {new Date(t.createdAt).toLocaleString()}</div>
                            <div className="desc">{t.description}</div>
                            <div className="controls" style={{marginTop:8}}>
                              <button className="icon-btn primary" onClick={()=>updateStatus(t.id,'in-progress')}>In Progress</button>
                              <button className="icon-btn" onClick={()=>updateStatus(t.id,'resolved')}>Resolve</button>
                            </div>
                          </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside>
            <div className="card">
              <h3>Summary</h3>
              <div className="small">Quick overview of tickets and actions.</div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default HrDashboard
