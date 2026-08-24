import { CalendarDays, ChevronRight, Link as LinkIcon } from "lucide-react";

function ApplicationCard({ application, isSelected, onSelect }) {
  return (
    <button
      type="button"
      className={`application-row ${isSelected ? "is-selected" : ""}`}
      onClick={() => onSelect(application)}
      aria-pressed={isSelected}
    >
      <span className="application-row-primary">
        <strong>{application.company}</strong>
        <span>{application.position}</span>
      </span>
      <span className={`status-badge ${application.status.toLowerCase()}`}>
        <i aria-hidden="true" />{application.status}
      </span>
      <span className="application-row-date">
        <CalendarDays size={14} aria-hidden="true" />
        {application.date_applied || "No date"}
      </span>
      <span className="application-row-source">
        {application.source_url && <LinkIcon size={14} aria-hidden="true" />}
        {application.platform || (application.source_url ? "Source" : "—")}
      </span>
      <ChevronRight className="application-row-chevron" size={17} aria-hidden="true" />
    </button>
  );
}

export default ApplicationCard;
