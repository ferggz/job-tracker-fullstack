import { ExternalLink, Pencil, Trash2, X } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import ReminderList from "./ReminderList";
import { useEffect, useState } from "react";

function ApplicationDetailPanel({ application, onClose, onEdit, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && !showDeleteModal) onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, showDeleteModal]);

  if (!application) return null;

  return (
    <div className="detail-layer">
      <button className="detail-scrim" onClick={onClose} aria-label="Close application details" />
      <aside className="detail-panel" aria-label={`${application.company} application details`}>
        <header className="detail-header">
          <div>
            <p className="detail-kicker">Application</p>
            <h2>{application.company}</h2>
            <p>{application.position}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close details">
            <X size={19} />
          </button>
        </header>

        <dl className="detail-properties">
          <div><dt>Status</dt><dd><span className={`status-badge ${application.status.toLowerCase()}`}><i aria-hidden="true" />{application.status}</span></dd></div>
          <div><dt>Applied</dt><dd>{application.date_applied || "Not specified"}</dd></div>
          <div><dt>Platform</dt><dd>{application.platform || "Not specified"}</dd></div>
        </dl>

        {application.source_url && (
          <a className="source-link" href={application.source_url} target="_blank" rel="noopener noreferrer">
            Open original offer <ExternalLink size={15} />
          </a>
        )}

        <section className="detail-section">
          <h3>Notes</h3>
          <p className={application.notes ? "application-notes" : "muted-copy"}>
            {application.notes || "No notes added."}
          </p>
        </section>

        <section className="detail-section">
          <ReminderList applicationId={application.id} />
        </section>

        <footer className="detail-actions">
          <button className="button-secondary" onClick={() => onEdit(application)}><Pencil size={16} />Edit</button>
          <button className="button-danger-quiet" onClick={() => setShowDeleteModal(true)}><Trash2 size={16} />Delete</button>
        </footer>

        {showDeleteModal && (
          <ConfirmModal
            title="Delete application?"
            message={`This will permanently delete ${application.company}.`}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={() => { onDelete(application.id); setShowDeleteModal(false); }}
          />
        )}
      </aside>
    </div>
  );
}

export default ApplicationDetailPanel;
