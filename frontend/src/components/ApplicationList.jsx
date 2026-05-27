import ApplicationCard from "./ApplicationCard"

function ApplicationList({ applications, handleEdit, handleDelete }) {
  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <h2>No applications found</h2>
        <p>Try changing your filters or add a new application.</p>
      </div>
    )
  }

  return (
    <div>
      {applications.map(application => (
        <ApplicationCard
          key={application.id}
          application={application}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  )
}

export default ApplicationList