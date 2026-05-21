import ApplicationCard from "./ApplicationCard"

function ApplicationList({ applications, handleEdit, handleDelete }) {
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