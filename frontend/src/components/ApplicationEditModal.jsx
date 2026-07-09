import { useState } from "react";
import ApplicationFields from "./ApplicationFields";

function ApplicationEditModal({ application, loading, onClose, onSubmit }) {
  const [company, setCompany] = useState(application.company);
  const [position, setPosition] = useState(application.position);
  const [status, setStatus] = useState(application.status);
  const [platform, setPlatform] = useState(application.platform ?? "");
  const [sourceUrl, setSourceUrl] = useState(application.source_url ?? "");
  const [dateApplied, setDateApplied] = useState(application.date_applied);
  const [notes, setNotes] = useState(application.notes ?? "");

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
        <h2 id="edit-application-title">Edit application</h2>

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
