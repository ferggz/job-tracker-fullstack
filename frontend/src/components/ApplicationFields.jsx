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
    <>
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

      <select
        value={platform}
        onChange={(event) => setPlatform(event.target.value)}
      >
        <option value="">Select platform</option>
        {PLATFORMS.map((platformOption) => (
          <option key={platformOption} value={platformOption}>
            {platformOption}
          </option>
        ))}
      </select>

      <input
        type="url"
        placeholder="Job offer URL"
        value={sourceUrl}
        onChange={(event) => {
          const url = event.target.value;

          setSourceUrl(url);

          const detectedPlatform = detectPlatformFromUrl(url);

          if (detectedPlatform) {
            setPlatform(detectedPlatform);
          }
        }}
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
        {APPLICATION_STATUSES.map((statusOption) => (
          <option key={statusOption} value={statusOption}>
            {statusOption}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        rows={3}
      />
    </>
  );
}

export default ApplicationFields;
