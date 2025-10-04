import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [role, setRole] = useState('employee') // 'employee' or 'hr'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validate = () => {
    if (!email) return 'Email is required.'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Enter a valid email.'
    if (!password) return 'Password is required.'
    if (password.length < 6) return 'Password must be at least 6 characters.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const v = validate()
    if (v) {
      setError(v)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, email, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || `Login failed: ${res.status}`)
      }

      // On success, backend should return user info + token (this is a convention)
      const data = await res.json()
      // Save token if provided
      if (data.token) localStorage.setItem('token', data.token)

      // Navigate to a simple dashboard route depending on role
      if (role === 'hr') navigate('/hr-dashboard')
      else navigate('/employee-dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-root">
      <Navbar />
      <main className="login-container">
        <div className="login-card" role="main">
          <h1 className="login-title">Sign in</h1>

          <p className="login-sub">Access for Employees and HR</p>

          <div className="role-toggle" role="tablist" aria-label="Select role">
            <button
              type="button"
              aria-pressed={role === 'employee'}
              className={`role-btn ${role === 'employee' ? 'active' : ''}`}
              onClick={() => setRole('employee')}
            >
              Employee
            </button>
            <button
              type="button"
              aria-pressed={role === 'hr'}
              className={`role-btn ${role === 'hr' ? 'active' : ''}`}
              onClick={() => setRole('hr')}
            >
              HR
            </button>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="field">
              <span className="label-text">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                aria-label="email"
                required
              />
            </label>

            <label className="field">
              <span className="label-text">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                aria-label="password"
                required
              />
            </label>

            {error && <div className="error" role="alert">{error}</div>}

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : `Sign in as ${role === 'hr' ? 'HR' : 'Employee'}`}
            </button>
          </form>

          <div className="login-foot">
            <small>Don't have an account? Contact HR to create one.</small>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Login