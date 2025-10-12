import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import './tickets.css'
import './dashboard.css'

const EmployeeDashboard = () => {
  const [data, setData] = useState(null)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('general')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    // Fetch basic employee data
    fetch('/api/employee-data', { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      .then((r) => { if (!r.ok) throw new Error(`Status ${r.status}`); return r.json() })
      .then((json) => setData(json.data))
      .catch((err) => setError(err.message))

    // Fetch tickets
    fetch('/api/employee-tickets', { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      .then((r) => { if (!r.ok) throw new Error(`Status ${r.status}`); return r.json() })
      .then((json) => setTickets(json.tickets || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  const submitTicket = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/employee-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ title, category, description }),
      })
      if (!res.ok) {
        const d = await res.json().catch(()=>({}));
        throw new Error(d.message || `Status ${res.status}`)
      }
      const json = await res.json()
      setTickets((t) => [json.ticket, ...t])
      setTitle('')
      setCategory('general')
      setDescription('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Navbar />
      <main className="page-container">
        <div className="header-row">
          <h1>Employee Dashboard</h1>
          <div>
            <button onClick={logout}>Logout</button>
          </div>
        </div>

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <div className="stats-grid">
          <div className="card">
            <h3>Welcome</h3>
            <div className="stat">{data ? data.welcome : '—'}</div>
            <div className="small">User info</div>
          </div>
          <div className="card">
            <h3>Open Tasks</h3>
            <div className="stat">{data ? data.tasks.length : 0}</div>
            <div className="small">Tasks assigned</div>
          </div>
          <div className="card">
            <h3>Announcements</h3>
            <div className="stat">{data ? data.announcements.length : 0}</div>
            <div className="small">Company news</div>
          </div>
        </div>

        <div className="main-grid">
          <div>
            <div className="card">
              <h3>Create complaint ticket</h3>
              <form className="ticket-form" onSubmit={submitTicket}>
                <div className="form-row">
                  <input placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required />
                  <select value={category} onChange={(e)=>setCategory(e.target.value)}>
                    <option value="general">General</option>
                    <option value="payroll">Payroll</option>
                    <option value="it">IT</option>
                    <option value="facilities">Facilities</option>
                  </select>
                </div>
                <div style={{ marginTop: 8 }}>
                  <textarea placeholder="Describe your issue" value={description} onChange={(e)=>setDescription(e.target.value)} rows={4} required className="ticket-form" />
                </div>
                <div style={{ marginTop: 8 }}>
                  <button type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Create ticket'}</button>
                </div>
              </form>
            </div>

            <div style={{ marginTop: 12 }} className="card">
              <h3>Your complaint tickets</h3>
              <div className="ticket-list">
                {tickets.length === 0 && <div className="small">No tickets yet</div>}
                {tickets.map(t => (
                  <div key={t.id} className="ticket">
                    <div className="title">{t.title} <span className="small">({t.category})</span></div>
                    <div className="meta">{t.status} — {new Date(t.createdAt).toLocaleString()}</div>
                    <div className="desc">{t.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside>
            <div className="card">
              <h3>Quick Actions</h3>
              <div className="small">You can create tickets and track their status here.</div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default EmployeeDashboard
