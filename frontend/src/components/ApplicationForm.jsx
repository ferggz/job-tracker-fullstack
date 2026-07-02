import { PlusCircle } from "lucide-react";

function ApplicationForm({
  company,
  setCompany,
  position,
  setPosition,
  status,
  setStatus,
  dateApplied,
  setDateApplied,
  handleSubmit,
  editingId,
  handleCancelEdit,
  loading,
}) {
  return (
    <section className="card application-form-card">
      <div className="form-card-header">
        <PlusCircle size={20} />
        <h2>{editingId ? "Edit application" : "New application"}</h2>
      </div>

      <form className="application-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(event) => setPosition(event.target.value)}
          required
        />

        <input
          type="date"
          value={dateApplied}
          onChange={(event) => setDateApplied(event.target.value)}
          max={new Date().toISOString().split("T")[0]}
        />

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Rejected">Rejected</option>
          <option value="Offer">Offer</option>
        </select>

        <button
          type="submit"
          disabled={loading || !company.trim() || !position.trim()}
        >
          {loading
            ? "Saving..."
            : editingId
              ? "Update application"
              : "Add application"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </form>
    </section>
  );
}

export default ApplicationForm;