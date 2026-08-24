import {
  APPLICATION_STATUSES,
  PLATFORMS,
  detectPlatformFromUrl,
} from "../constants/applications";

function ApplicationFields({
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
}) {
  return (
    <div className="application-fields">
      <label className="field">
        <span>Company</span>
        <input
          type="text"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          autoComplete="organization"
          required
          aria-required="true"
        />
      </label>

      <label className="field">
        <span>Position</span>
        <input
          type="text"
          value={position}
          onChange={(event) => setPosition(event.target.value)}
          autoComplete="organization-title"
          required
          aria-required="true"
        />
      </label>

      <label className="field">
        <span>Platform</span>
        <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
          <option value="">Not specified</option>
          {PLATFORMS.map((platformOption) => (
            <option key={platformOption} value={platformOption}>
              {platformOption}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Offer URL</span>
        <input
          type="url"
          placeholder="https://"
          value={sourceUrl}
          onChange={(event) => {
            const url = event.target.value;
            setSourceUrl(url);
            const detectedPlatform = detectPlatformFromUrl(url);
            if (detectedPlatform) setPlatform(detectedPlatform);
          }}
        />
      </label>

      <label className="field">
        <span>Applied date</span>
        <input
          type="date"
          value={dateApplied}
          onChange={(event) => setDateApplied(event.target.value)}
          max={new Date().toISOString().split("T")[0]}
        />
      </label>

      <label className="field">
        <span>Status</span>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          {APPLICATION_STATUSES.map((statusOption) => (
            <option key={statusOption} value={statusOption}>{statusOption}</option>
          ))}
        </select>
      </label>

      <label className="field field-notes">
        <span>Notes <small>Optional</small></span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
        />
      </label>
    </div>
  );
}

export default ApplicationFields;
