import { useEffect, useState } from "react";
import { X } from "lucide-react";
import ApplicationFields from "./ApplicationFields";

function ApplicationEditModal({ application, loading, onClose, onSubmit }) {
  const [company, setCompany] = useState(application.company);
  const [position, setPosition] = useState(application.position);
  const [status, setStatus] = useState(application.status);
  const [platform, setPlatform] = useState(application.platform ?? "");
  const [sourceUrl, setSourceUrl] = useState(application.source_url ?? "");
  const [dateApplied, setDateApplied] = useState(application.date_applied);
  const [notes, setNotes] = useState(application.notes ?? "");

  useEffect(() => {
    function handleKeyDown(event) { if (event.key === "Escape") onClose(); }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      company,
      position,
      status,
      platform,
      source_url: sourceUrl,
      date_applied: dateApplied,
      notes: notes.trim() || null,
    });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="edit-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-application-title"
      >
        <div className="modal-heading"><div><p className="page-kicker">Application</p><h2 id="edit-application-title">Edit application</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close edit form"><X size={19} /></button></div>

        <form className="application-form application-form-modal" onSubmit={handleSubmit}>
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

          <div className="modal-actions edit-modal-actions">
            <button type="button" className="button-secondary" onClick={onClose}>
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !company.trim() || !position.trim()}
            >
              {loading ? "Saving..." : "Update application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicationEditModal;
