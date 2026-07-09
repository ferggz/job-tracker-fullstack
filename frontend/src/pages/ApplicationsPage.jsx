import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ApplicationEditModal from "../components/ApplicationEditModal";
import ApplicationList from "../components/ApplicationList";
import ApplicationForm from "../components/ApplicationForm";
import UpcomingReminders from "../components/UpcomingReminders";
import MainLayout from "../layouts/MainLayout";
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
      toast.success("Application created.");
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

      setEditingApplication(null);
      toast.success("Application updated.");
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

      toast.success("Application deleted.");
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
      <section className="stats">
        <div>
          <strong>{totalApplications}</strong>
          <span>Total</span>
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

      <section className="card filters-card">
        <h2 className="section-title">Applications</h2>

        <div className="filters">
          <input
            type="text"
            placeholder="Search by company or position"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
          >
            <option value="All">All statuses</option>
            {APPLICATION_STATUSES.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="recent">Most recent</option>
            <option value="oldest">Oldest</option>
            <option value="company">Company A-Z</option>
            <option value="status">Status</option>
          </select>
        </div>
      </section>

      <p className="results-count">
        Showing {sortedApplications.length} of {applications.length} applications
      </p>

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
        handleEdit={handleEdit}
        handleDelete={handleDelete}
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
