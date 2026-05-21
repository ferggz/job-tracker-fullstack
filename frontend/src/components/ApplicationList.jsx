import ApplicationCard from "./ApplicationCard"

function ApplicationList({ applications, handleEdit, handleDelete }) {
    
if (applications.length === 0) {
  return (
    <div className="empty-state">
      <h2>No applications yet</h2>
      <p>Add your first job application to get started.</p>
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