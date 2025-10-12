import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token))
    return payload
  } catch (e) {
    return null
  }
}

const Dashboard = () => {
  const token = localStorage.getItem('token')
  const payload = token ? decodeToken(token) : null

  return (
    <div>
      <Navbar />
      <main style={{ padding: 20 }}>
        <h1>Main Dashboard</h1>
        {payload ? (
          <>
            <p>Signed in as: <strong>{payload.email}</strong> (<em>{payload.role}</em>)</p>
            <p>
              <Link to={payload.role === 'hr' ? '/hr-dashboard' : '/employee-dashboard'}>Go to your dashboard</Link>
            </p>
            <pre style={{ background: '#f6f6f6', padding: 12 }}>{JSON.stringify(payload, null, 2)}</pre>
          </>
        ) : (
          <p>You are not signed in. <Link to="/login">Sign in</Link></p>
        )}
      </main>
    </div>
  )
}

export default Dashboard