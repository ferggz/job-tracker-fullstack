import ReminderList from "./ReminderList"
import { openApplicationCv, uploadApplicationCv } from "../services/api"

async function handleCvUpload(event) {
  const file = event.target.files[0]

  if (!file) {
    return
  }

  await uploadApplicationCv(application.id, file)

  alert("CV uploaded successfully")
}


function ApplicationCard({ application, handleEdit, handleDelete }) {
  return (
    <div className="application-card">
      <h2>{application.company}</h2>

      <p>{application.position}</p>

      <p>Applied on: {application.date_applied}</p>

      <div className="cv-upload">
        <label>
          Upload CV:
          <input
            type="file"
            accept="application/pdf"
            onChange={handleCvUpload}
          />
        </label>

        <button type="button" onClick={() => openApplicationCv(application.id)}>
          View CV
        </button>
      </div>

      <span className={`status-badge ${application.status.toLowerCase()}`}>
        {application.status}
        </span>

      <ReminderList applicationId={application.id} />

      <div className="card-buttons">
        <button className="edit-button" onClick={() => handleEdit(application)}>
          Edit
        </button>

        <button
          className="delete-button"
          onClick={() => {
            if (window.confirm("Delete this application?")) {
              handleDelete(application.id)
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default ApplicationCard