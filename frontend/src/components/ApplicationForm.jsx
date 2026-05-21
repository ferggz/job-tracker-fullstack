function ApplicationForm({
  company,
  setCompany,
  position,
  setPosition,
  status,
  setStatus,
  handleSubmit,
  editingId
}) {
  return (
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
  )
}

export default ApplicationForm