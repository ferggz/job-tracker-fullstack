import { useEffect, useState } from "react"
import ApplicationCard from "./components/ApplicationCard"
import ApplicationList from "./components/ApplicationList"
import ApplicationForm from "./components/ApplicationForm"
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication
} from "./services/api"
import "./App.css"

function App() {
  const [applications, setApplications] = useState([])
  const [company, setCompany] = useState("")
  const [position, setPosition] = useState("")
  const [status, setStatus] = useState("Applied")
  const [editingId, setEditingId] = useState(null)
  const [filterStatus, setFilterStatus] = useState(
      localStorage.getItem("filterStatus") || "All"
    )

  const [sortBy, setSortBy] = useState(
      localStorage.getItem("sortBy") || "recent"
    )
  const [searchTerm, setSearchTerm] = useState("")
  const [dateApplied, setDateApplied] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
  localStorage.setItem("filterStatus", filterStatus)
  localStorage.setItem("sortBy", sortBy)
}, [filterStatus, sortBy])

  async function fetchApplications() {
  try {
    const data = await getApplications()
    setApplications(data)
    setError("")
  } catch {
    setError("Could not connect to the server. Please try again later.")
  }
}

  async function handleSubmit(event) {
    event.preventDefault()

    setLoading(true)

    const application = {
      company,
      position,
      status,
      date_applied: dateApplied
    }

    try {
      if (editingId) {
        const updatedApplication = await updateApplication(
          editingId,
          application,
        )

        setApplications(
          applications.map(application =>
            application.id === editingId
              ? updatedApplication
              : application
          )
        )

        setEditingId(null)
      } else {
        const newApplication = await createApplication(application)

        setApplications([...applications, newApplication])
      }

      setCompany("")
      setPosition("")
      setStatus("Applied")
      setDateApplied("")
      setError("")
      } catch {
        setError("Something went wrong while saving the application.")
      } finally {
        setLoading(false)
      }
  }

  async function handleDelete(id) {

    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    )

    if (!confirmed) {
      return
    }

    await deleteApplication(id)

    setApplications(
      applications.filter(application => application.id !== id)
    )
  }

function handleEdit(application) {
  setEditingId(application.id)
  setCompany(application.company)
  setPosition(application.position)
  setStatus(application.status)
  setDateApplied(application.date_applied)
}

const statusOrder = {
  Offer: 1,
  Interview: 2,
  Applied: 3,
  Rejected: 4
}

const filteredApplications = applications.filter(application => {
  const matchesStatus =
    filterStatus === "All" || application.status === filterStatus

  const matchesSearch =
    application.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    application.position.toLowerCase().includes(searchTerm.toLowerCase())

  return matchesStatus && matchesSearch
})

const sortedApplications = [...filteredApplications].sort((a, b) => {

  if (sortBy === "recent") {
    return new Date(b.date_applied) - new Date(a.date_applied)
  }

  if (sortBy === "oldest") {
    return new Date(a.date_applied) - new Date(b.date_applied)
  }

  if (sortBy === "company") {
    return a.company.localeCompare(b.company)
  }

  if (sortBy === "status") {
    return statusOrder[a.status] - statusOrder[b.status]
  }

  return 0
})

const totalApplications = applications.length
const interviews = applications.filter(
  application => application.status === "Interview"
).length
const offers = applications.filter(
  application => application.status === "Offer"
).length

function handleCancelEdit() {
  setEditingId(null)
  setCompany("")
  setPosition("")
  setStatus("Applied")
}

  return (
    <main className="app">
      <section className="hero">
        <h1>Job Tracker</h1>
        <p>Track your job applications from one simple dashboard.</p>
      </section>

      {error && <p className="error-message">{error}</p>}

      <section className="stats">
        <div>
          <strong>{totalApplications}</strong>
          <span>Total</span>
        </div>

        <div>
          <strong>{interviews}</strong>
          <span>Interviews</span>
        </div>

        <div>
          <strong>{offers}</strong>
          <span>Offers</span>
        </div>
      </section>

      <section className="filters">
      <input
        type="text"
        placeholder="Search by company or position"
        value={searchTerm}
        onChange={event => setSearchTerm(event.target.value)}
      />

      <select
        value={filterStatus}
        onChange={event => setFilterStatus(event.target.value)}
      >
        <option value="All">All statuses</option>
        <option value="Offer">Offer</option>
        <option value="Interview">Interview</option>
        <option value="Applied">Applied</option>
        <option value="Rejected">Rejected</option>
      </select>

      <select
        value={sortBy}
        onChange={event => setSortBy(event.target.value)}
      >
        <option value="recent">Most recent</option>
        <option value="oldest">Oldest</option>
        <option value="company">Company A-Z</option>
        <option value="status">Status</option>
      </select>
    </section>

      <p className="results-count">
        Showing {sortedApplications.length} of {applications.length} applications
      </p>

      <ApplicationForm
        company={company}
        setCompany={setCompany}
        position={position}
        setPosition={setPosition}
        status={status}
        setStatus={setStatus}
        dateApplied={dateApplied}
        setDateApplied={setDateApplied}
        handleSubmit={handleSubmit}
        editingId={editingId}
        handleCancelEdit={handleCancelEdit}
        loading={loading}
      />

      <ApplicationList
        applications={sortedApplications}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </main>
  )
}

export default App