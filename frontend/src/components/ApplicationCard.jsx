import ReminderList from "./ReminderList"

function ApplicationCard({ application, handleEdit, handleDelete }) {
  return (
    <div className="application-card">
      <h2>{application.company}</h2>

      <p>{application.position}</p>

      <p>Applied on: {application.date_applied}</p>

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