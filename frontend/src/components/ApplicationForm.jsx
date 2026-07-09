import { PlusCircle } from "lucide-react";
import ApplicationFields from "./ApplicationFields";

function ApplicationForm({
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
    <section className="card application-form-card">
      <div className="form-card-header">
        <PlusCircle size={20} />
        <h2>New application</h2>
      </div>

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

        <button
          type="submit"
          disabled={loading || !company.trim() || !position.trim()}
        >
          {loading ? "Saving..." : "Add application"}
        </button>
      </form>
    </section>
  );
}

export default ApplicationForm;
