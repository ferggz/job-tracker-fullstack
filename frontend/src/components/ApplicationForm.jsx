import { Minus, Plus } from "lucide-react";
import ApplicationFields from "./ApplicationFields";

function ApplicationForm({
  isOpen,
  onToggle,
  onCancel,
  company,
  setCompany,
  position,
  setPosition,
  status,
  setStatus,
  platform,
  setPlatform,
  sourceUrl,
  setSourceUrl,
  notes,
  setNotes,
  dateApplied,
  setDateApplied,
  handleSubmit,
  loading,
}) {
  return (
    <section className={`card application-form-card ${isOpen ? "is-open" : ""}`}>
      <button
        type="button"
        className="form-card-header form-card-toggle"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        <h2>New application</h2>
      </button>

      <div className="application-form-collapse">
        <div className="application-form-collapse-inner">
          <form className="application-form" onSubmit={handleSubmit}>
            <ApplicationFields
              company={company}
              setCompany={setCompany}
              position={position}
              setPosition={setPosition}
              status={status}
              setStatus={setStatus}
              platform={platform}
              setPlatform={setPlatform}
              sourceUrl={sourceUrl}
              setSourceUrl={setSourceUrl}
              notes={notes}
              setNotes={setNotes}
              dateApplied={dateApplied}
              setDateApplied={setDateApplied}
            />

            <div className="application-form-actions">
              <button
                type="button"
                className="button-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || !company.trim() || !position.trim()}
              >
                {loading ? "Saving..." : "Add application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ApplicationForm;
