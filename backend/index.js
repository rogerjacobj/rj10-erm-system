const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(express.json());
// Allow frontend dev server to call this API during development
app.use(cors({ origin: true }));

// Simple health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Mock login endpoint for local development and frontend testing
// Accepts { email, password, role } and returns a simple token + user
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body || {}
    if (!email || !password || !role) {
        return res.status(400).json({ message: 'email, password and role are required' })
    }

    // NOTE: This is a mock. Replace with real auth logic.
    if (password !== 'password123') {
        return res.status(401).json({ message: 'Invalid credentials. For local tests use password: password123' })
    }

    // Issue a simple token that includes role (not secure, just for local dev)
    const payload = { email, role, iat: Date.now() }
    const token = Buffer.from(JSON.stringify(payload)).toString('base64')
    return res.json({ token, user: { email, role } })
})

// Simple middleware to check our mock token
function ensureAuth(req, res, next) {
    const auth = req.headers.authorization || ''
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing token' })
    const token = auth.slice(7)
    try {
        const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf8'))
        req.user = payload
        return next()
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}

// Employee data endpoint (protected)
app.get('/api/employee-data', ensureAuth, (req, res) => {
    // Only employees or HR can access; HR may get broader data
    const { role, email } = req.user || {}
    if (role !== 'employee' && role !== 'hr') {
        return res.status(403).json({ message: 'Forbidden' })
    }

    // Dummy employee-specific payload
    const data = {
        welcome: `Welcome ${email}`,
        tasks: [
            { id: 1, title: 'Submit timesheet', due: '2025-10-20' },
            { id: 2, title: 'Complete safety training', due: '2025-11-01' },
        ],
        announcements: [
            { id: 1, text: 'Office closed on 31st Oct for maintenance' }
        ]
    }

    return res.json({ role, data })
})

// HR data endpoint (protected)
app.get('/api/hr-data', ensureAuth, (req, res) => {
    const { role } = req.user || {}
    if (role !== 'hr') return res.status(403).json({ message: 'Only HR can access this' })

    // Dummy HR payload
    const hr = {
        openPositions: [
            { id: 'p-1', title: 'Frontend Engineer', applicants: 12 },
            { id: 'p-2', title: 'Office Manager', applicants: 3 },
        ],
        employees: [
            { id: 'e-1', name: 'Alice Johnson', email: 'alice@company.com' },
            { id: 'e-2', name: 'Bob Smith', email: 'bob@company.com' },
        ]
    }

    return res.json({ role, hr })
})

const fs = require('fs')
const path = require('path')

// Simple file persistence for employees
const EMPLOYEES_FILE = path.join(__dirname, 'employees.json')
function loadEmployees() {
    try {
        const raw = fs.readFileSync(EMPLOYEES_FILE, 'utf8')
        return JSON.parse(raw)
    } catch (err) {
        return []
    }
}

function saveEmployees(employees) {
    try {
        fs.writeFileSync(EMPLOYEES_FILE, JSON.stringify(employees, null, 2), 'utf8')
    } catch (err) {
        console.error('Failed to save employees', err)
    }
}

// In-memory employee storage
const employeesStore = loadEmployees()

// List all employees (HR only)
app.get('/api/employees', ensureAuth, (req, res) => {
    const { role } = req.user || {}
    if (role !== 'hr') return res.status(403).json({ message: 'Only HR can access employee list' })
    return res.json({ employees: employeesStore })
})

// Add new employee (HR only)
app.post('/api/employees', ensureAuth, (req, res) => {
    const { role } = req.user || {}
    if (role !== 'hr') return res.status(403).json({ message: 'Only HR can add employees' })

    const { email, name, department, employeeRole } = req.body || {}
    if (!email || !name || !employeeRole) {
        return res.status(400).json({ message: 'email, name, and employeeRole are required' })
    }

    // Check if email already exists
    if (employeesStore.find(e => e.email === email)) {
        return res.status(409).json({ message: 'Employee with this email already exists' })
    }

    const employee = {
        id: `emp-${Date.now()}`,
        email,
        name,
        role: employeeRole,
        department: department || 'General',
        createdAt: new Date().toISOString(),
        status: 'active'
    }

    employeesStore.push(employee)
    saveEmployees(employeesStore)

    return res.status(201).json({ employee })
})

// Remove employee (HR only)
app.delete('/api/employees/:id', ensureAuth, (req, res) => {
    const { role } = req.user || {}
    if (role !== 'hr') return res.status(403).json({ message: 'Only HR can remove employees' })

    const { id } = req.params
    const index = employeesStore.findIndex(e => e.id === id)
    
    if (index === -1) return res.status(404).json({ message: 'Employee not found' })

    const [removed] = employeesStore.splice(index, 1)
    saveEmployees(employeesStore)

    return res.json({ employee: removed })
})

// Simple file persistence for tickets
const TICKETS_FILE = path.join(__dirname, 'tickets.json')
function loadTickets() {
    try {
        const raw = fs.readFileSync(TICKETS_FILE, 'utf8')
        return JSON.parse(raw)
    } catch (err) {
        return {}
    }
}

function saveTickets(store) {
    try {
        fs.writeFileSync(TICKETS_FILE, JSON.stringify(store, null, 2), 'utf8')
    } catch (err) {
        console.error('Failed to save tickets', err)
    }
}

// In-memory ticket storage for local testing: loaded from disk and saved on changes
const ticketsStore = loadTickets()

// Get tickets for the logged-in user
app.get('/api/employee-tickets', ensureAuth, (req, res) => {
    const { email, role } = req.user || {}
    // Only employee or hr may fetch; HR can pass ?userEmail= to fetch another user's tickets
    const queryEmail = req.query.userEmail
    const target = role === 'hr' && queryEmail ? queryEmail : email
    const tickets = ticketsStore[target] || []
    return res.json({ tickets })
})

// Create a ticket for the logged-in user
app.post('/api/employee-tickets', ensureAuth, (req, res) => {
    const { email } = req.user || {}
    const { title, description, category } = req.body || {}
    if (!title || !description) return res.status(400).json({ message: 'title and description required' })

    const ticket = {
        id: `t-${Date.now()}`,
        title,
        description,
        category: category || 'general',
        status: 'open',
        createdAt: new Date().toISOString(),
    }

    ticketsStore[email] = ticketsStore[email] || []
    ticketsStore[email].unshift(ticket)
    // persist
    saveTickets(ticketsStore)
    return res.status(201).json({ ticket })
})

// Update a ticket (status, description, category) - accessible to owner or HR
app.patch('/api/employee-tickets/:id', ensureAuth, (req, res) => {
    const { id } = req.params
    const { email: requesterEmail, role } = req.user || {}
    const { status, description, category } = req.body || {}

    // find ticket in store
    let found = null
    let ownerEmail = null
    for (const userEmail of Object.keys(ticketsStore)) {
        const list = ticketsStore[userEmail]
        const t = list.find(x => x.id === id)
        if (t) { found = t; ownerEmail = userEmail; break }
    }

    if (!found) return res.status(404).json({ message: 'Ticket not found' })

    // only owner or HR can update
    if (ownerEmail !== requesterEmail && role !== 'hr') return res.status(403).json({ message: 'Forbidden' })

    if (status) found.status = status
    if (description) found.description = description
    if (category) found.category = category

    // save
    saveTickets(ticketsStore)
    return res.json({ ticket: found })
})

// HR-only: list all tickets across users
app.get('/api/all-tickets', ensureAuth, (req, res) => {
    const { role } = req.user || {}
    if (role !== 'hr') return res.status(403).json({ message: 'Only HR can access this' })
    return res.json({ ticketsByUser: ticketsStore })
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})