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

  useEffect(() => {
    fetchApplications()
  }, [])

  async function fetchApplications() {
    const data = await getApplications()
    setApplications(data)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const application = {
      company,
      position,
      status
    }

    if (editingId) {
      const updatedApplication = await updateApplication(editingId, application)

      setApplications(
        applications.map(application =>
          application.id === editingId ? updatedApplication : application
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
  }

  async function handleDelete(id) {
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
}

  return (
    <main className="app">
      <section className="hero">
        <h1>Job Tracker</h1>
        <p>Track your job applications from one simple dashboard.</p>
      </section>

      <ApplicationForm
        company={company}
        setCompany={setCompany}
        position={position}
        setPosition={setPosition}
        status={status}
        setStatus={setStatus}
        handleSubmit={handleSubmit}
        editingId={editingId}
      />

      <ApplicationList
        applications={applications}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </main>
  )
}

export default App