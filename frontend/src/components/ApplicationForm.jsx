function ApplicationForm({
  company,
  setCompany,
  position,
  setPosition,
  status,
  setStatus,
  handleSubmit,
  editingId,
  handleCancelEdit
}) {
  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={event => setCompany(event.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Position"
        value={position}
        onChange={event => setPosition(event.target.value)}
        required
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

      <button
        type="submit"
        disabled={!company.trim() || !position.trim()}
        >
        {editingId ? "Update application" : "Add application"}
      </button>

      {editingId && (
        <button type="button" onClick={handleCancelEdit}>
            Cancel
        </button>
        )}
    </form>
  )
}

export default ApplicationForm