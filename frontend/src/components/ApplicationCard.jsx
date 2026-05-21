function ApplicationCard({ application, handleEdit, handleDelete }) {
  return (
    <div>
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
  )
}

export default ApplicationCard