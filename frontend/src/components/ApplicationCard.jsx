import { useState } from "react";
import {
  Building2,
  CalendarDays,
  Pencil,
  Trash2,
  Link as LinkIcon,
} from "lucide-react";
import ReminderList from "./ReminderList";
import ConfirmModal from "./ConfirmModal";

function ApplicationCard({ application, handleEdit, handleDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <article className="application-card">
      <div className="application-header">
        <div>
          <div className="application-company">
            <Building2 size={20} />
            <h2>{application.company}</h2>
          </div>

          <p className="application-position">{application.position}</p>

          {(application.platform || application.source_url) && (
            <div className="application-source">
              {application.platform && (
                <span>{application.platform}</span>
              )}

              {application.platform && application.source_url && (
                <span> • </span>
              )}

              {application.source_url && (
                <a
                  href={application.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkIcon size={14} />
                  <span>View offer</span>
                </a>
              )}
            </div>
          )}
        </div>

        <span className={`status-badge ${application.status.toLowerCase()}`}>
          {application.status}
        </span>
      </div>

      <p className="application-date">
        <CalendarDays size={16} />
        <span>Applied on {application.date_applied}</span>
      </p>

      {application.notes && (
        <p className="application-notes">{application.notes}</p>
      )}

      <ReminderList applicationId={application.id} />

      <div className="card-buttons">
        <button className="button-secondary" onClick={() => handleEdit(application)}>
          <Pencil size={16} />
          <span>Edit</span>
        </button>

        <button
          className="button-danger"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </div>

      {showDeleteModal && (
        <ConfirmModal
          title="Delete application?"
          message={`This will permanently delete ${application.company}.`}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            handleDelete(application.id);
            setShowDeleteModal(false);
          }}
        />
      )}
    </article>
  );
}

export default ApplicationCard;