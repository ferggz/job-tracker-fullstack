import ApplicationCard from "./ApplicationCard"

function ApplicationList({ applications, selectedApplication, onSelect }) {
  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <h2>No applications found</h2>
        <p>Try changing your filters or add a new application.</p>
      </div>
    )
  }

  return (
    <div className="application-list" role="list" aria-label="Job applications">
      <div className="application-list-header" aria-hidden="true">
        <span>Company / position</span><span>Status</span><span>Applied</span><span>Source</span><span />
      </div>
      {applications.map(application => (
        <div role="listitem" key={application.id}>
          <ApplicationCard
            application={application}
            isSelected={selectedApplication?.id === application.id}
            onSelect={onSelect}
          />
        </div>
      ))}
    </div>
  )
}

export default ApplicationList
