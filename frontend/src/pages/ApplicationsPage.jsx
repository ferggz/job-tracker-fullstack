import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ApplicationEditModal from "../components/ApplicationEditModal";
import ApplicationList from "../components/ApplicationList";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationDetailPanel from "../components/ApplicationDetailPanel";
import UpcomingReminders from "../components/UpcomingReminders";
import MainLayout from "../layouts/MainLayout";
import { Search, SlidersHorizontal } from "lucide-react";
import { APPLICATION_STATUSES, STATUS_ORDER } from "../constants/applications";
import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication,
} from "../services/api";

const EMPTY_FORM = {
  company: "",
  position: "",
  status: "Applied",
  platform: "",
  sourceUrl: "",
  dateApplied: "",
  notes: "",
};

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState(EMPTY_FORM.company);
  const [position, setPosition] = useState(EMPTY_FORM.position);
  const [status, setStatus] = useState(EMPTY_FORM.status);
  const [platform, setPlatform] = useState(EMPTY_FORM.platform);
  const [sourceUrl, setSourceUrl] = useState(EMPTY_FORM.sourceUrl);
  const [editingApplication, setEditingApplication] = useState(null);
  const [filterStatus, setFilterStatus] = useState(
    localStorage.getItem("filterStatus") || "All",
  );
  const [sortBy, setSortBy] = useState(
    localStorage.getItem("sortBy") || "recent",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [dateApplied, setDateApplied] = useState(EMPTY_FORM.dateApplied);
  const [notes, setNotes] = useState(EMPTY_FORM.notes);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await getApplications();
        setApplications(data);
      } catch {
        toast.error("Could not load applications.");
      }
    }

    loadApplications();
  }, []);

  useEffect(() => {
    localStorage.setItem("filterStatus", filterStatus);
    localStorage.setItem("sortBy", sortBy);
  }, [filterStatus, sortBy]);

  function resetCreateForm() {
    setCompany(EMPTY_FORM.company);
    setPosition(EMPTY_FORM.position);
    setStatus(EMPTY_FORM.status);
    setDateApplied(EMPTY_FORM.dateApplied);
    setPlatform(EMPTY_FORM.platform);
    setSourceUrl(EMPTY_FORM.sourceUrl);
    setNotes(EMPTY_FORM.notes);
  }

  async function handleCreate(event) {
    event.preventDefault();
    setLoading(true);

    const application = {
      company,
      position,
      status,
      platform,
      source_url: sourceUrl,
      date_applied: dateApplied,
      notes: notes.trim() || null,
    };

    try {
      const newApplication = await createApplication(application);
      setApplications([...applications, newApplication]);
      resetCreateForm();
      setIsCreateFormOpen(false);
    } catch {
      toast.error("Could not save application.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancelCreate() {
    resetCreateForm();
    setIsCreateFormOpen(false);
  }

  async function handleUpdate(applicationData) {
    if (!editingApplication) {
      return;
    }

    setEditLoading(true);

    try {
      const updatedApplication = await updateApplication(
        editingApplication.id,
        applicationData,
      );

      setApplications(
        applications.map((item) =>
          item.id === editingApplication.id ? updatedApplication : item,
        ),
      );

      if (selectedApplication?.id === editingApplication.id) {
        setSelectedApplication(updatedApplication);
      }

      setEditingApplication(null);
    } catch {
      toast.error("Could not save application.");
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteApplication(id);

      setApplications(
        applications.filter((application) => application.id !== id),
      );
      if (selectedApplication?.id === id) setSelectedApplication(null);

    } catch {
      toast.error("Could not delete application.");
    }
  }

  function handleEdit(application) {
    setEditingApplication(application);
  }

  const filteredApplications = applications.filter((application) => {
    const matchesStatus =
      filterStatus === "All" || application.status === filterStatus;

    const matchesSearch =
      application.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.position.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === "recent") return new Date(b.date_applied) - new Date(a.date_applied);
    if (sortBy === "oldest") return new Date(a.date_applied) - new Date(b.date_applied);
    if (sortBy === "company") return a.company.localeCompare(b.company);
    if (sortBy === "status") return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];

    return 0;
  });

  const totalApplications = applications.length;
  const interviews = applications.filter(
    (application) => application.status === "Interview",
  ).length;
  const offers = applications.filter(
    (application) => application.status === "Offer",
  ).length;

  return (
    <MainLayout>
      <header className="page-header">
        <div>
          <p className="page-kicker">Workspace</p>
          <h1>Applications</h1>
          <p>Review and update every active opportunity.</p>
        </div>
        <button className="header-action" onClick={() => setIsCreateFormOpen(true)}>
          Add application
        </button>
      </header>

      <section className="stats" aria-label="Application summary">
        <div className="stat-primary">
          <strong>{totalApplications}</strong>
          <span>Total applications</span>
        </div>
        <div>
          <strong>{interviews}</strong>
          <span>Interviews</span>
        </div>
        <div>
          <strong>{offers}</strong>
          <span>Offers</span>
        </div>
      </section>

      <UpcomingReminders />

      <section className="workspace-section">
        <div className="workspace-heading">
          <div>
            <h2>All applications</h2>
            <p>{sortedApplications.length} of {applications.length} shown</p>
          </div>
          <SlidersHorizontal size={18} aria-hidden="true" />
        </div>

        <div className="filters" aria-label="Application controls">
          <label className="search-control">
            <span className="sr-only">Find in applications</span>
            <Search size={17} aria-hidden="true" />
            <input type="search" placeholder="Find company or position" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </label>

          <label className="select-control">
            <span className="sr-only">Filter by status</span>
            <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
              <option value="All">All statuses</option>
              {APPLICATION_STATUSES.map((statusOption) => <option key={statusOption} value={statusOption}>{statusOption}</option>)}
            </select>
          </label>

          <label className="select-control">
            <span className="sr-only">Sort applications</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="recent">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="company">Company A–Z</option>
              <option value="status">Status</option>
            </select>
          </label>
        </div>
      </section>

      <ApplicationForm
        isOpen={isCreateFormOpen}
        onToggle={() => setIsCreateFormOpen((open) => !open)}
        onCancel={handleCancelCreate}
        company={company}
        setCompany={setCompany}
        position={position}
        setPosition={setPosition}
        status={status}
        setStatus={setStatus}
        dateApplied={dateApplied}
        setDateApplied={setDateApplied}
        handleSubmit={handleCreate}
        loading={loading}
        platform={platform}
        setPlatform={setPlatform}
        sourceUrl={sourceUrl}
        setSourceUrl={setSourceUrl}
        notes={notes}
        setNotes={setNotes}
      />

      <ApplicationList
        applications={sortedApplications}
        selectedApplication={selectedApplication}
        onSelect={setSelectedApplication}
      />

      <ApplicationDetailPanel
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {editingApplication && (
        <ApplicationEditModal
          key={editingApplication.id}
          application={editingApplication}
          loading={editLoading}
          onClose={() => setEditingApplication(null)}
          onSubmit={handleUpdate}
        />
      )}
    </MainLayout>
  );
}

export default ApplicationsPage;
