import { useEffect, useState } from "react"

function App() {
  const [applications, setApplications] = useState([])
  const [company, setCompany] = useState("")
  const [position, setPosition] = useState("")
  const [status, setStatus] = useState("Applied")
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  function fetchApplications() {
    fetch("http://127.0.0.1:8000/applications")
      .then(response => response.json())
      .then(data => setApplications(data))
      .catch(error => console.error(error))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const newApplication = {
      company: company,
      position: position,
      status: status
    }

    fetch(
      editingId
        ? `http://127.0.0.1:8000/applications/${editingId}`
        : "http://127.0.0.1:8000/applications",
      {
        method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newApplication)
    })
      .then(response => response.json())
      .then(data => {
        if (editingId) {
          setApplications(
            applications.map(application =>
              application.id === editingId ? data : application
            )
          )
          setEditingId(null)
        } else {
          setApplications([...applications, data])
        }

        setCompany("")
        setPosition("")
        setStatus("Applied")
      })
      .catch(error => console.error(error))
  }

  function handleDelete(id) {
  fetch(`http://127.0.0.1:8000/applications/${id}`, {
    method: "DELETE"
  })
    .then(response => response.json())
    .then(() => {
      setApplications(applications.filter(application => application.id !== id))
    })
    .catch(error => console.error(error))
}

function handleEdit(application) {
  setEditingId(application.id)
  setCompany(application.company)
  setPosition(application.position)
  setStatus(application.status)
}

  return (
    <div>
      <h1>Job Tracker</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={event => setCompany(event.target.value)}
        />

        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={event => setPosition(event.target.value)}
        />

        <select
          value={status}
          onChange={event => setStatus(event.target.value)}
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Rejected">Rejected</option>
          <option value="Offer">Offer</option>
        </select>

        <button type="submit">
          {editingId ? "Update application" : "Add application"}
        </button>
      </form>

      {applications.map(application => (
        <div key={application.id}>
          <h2>{application.company}</h2>
          <p>{application.position}</p>
          <p>{application.status}</p>

          <button onClick={() => handleEdit(application)}>
            Edit
          </button>

          <button onClick={() => handleDelete(application.id)}>
            Delete
          </button>

        </div>
      ))}
    </div>
  )
}

export default App