import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ApplicationList from "../components/ApplicationList";
import ApplicationForm from "../components/ApplicationForm";
import UpcomingReminders from "../components/UpcomingReminders";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../services/api";

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");
  const [platform, setPlatform] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState(
    localStorage.getItem("filterStatus") || "All",
  );
  const [sortBy, setSortBy] = useState(
    localStorage.getItem("sortBy") || "recent",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("filterStatus", filterStatus);
    localStorage.setItem("sortBy", sortBy);
  }, [filterStatus, sortBy]);

  async function fetchApplications() {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const application = {
      company,
      position,
      status,
      platform,
      source_url: sourceUrl,
      date_applied: dateApplied,
    };

    try {
      if (editingId) {
        const updatedApplication = await updateApplication(editingId, application);

        setApplications(
          applications.map((application) =>
            application.id === editingId ? updatedApplication : application,
          ),
        );

        setEditingId(null);
        toast.success("Application updated.");
      } else {
        const newApplication = await createApplication(application);
        setApplications([...applications, newApplication]);
        toast.success("Application created.");
      }

      setCompany("");
      setPosition("");
      setStatus("Applied");
      setDateApplied("");
      setPlatform("");
      setSourceUrl("");
    } catch {
      toast.error("Could not save application.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmed) {
      return;
    }

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
    setEditingId(application.id);
    setCompany(application.company);
    setPosition(application.position);
    setStatus(application.status);
    setDateApplied(application.date_applied);
    setPlatform(application.platform ?? "");
    setSourceUrl(application.source_url ?? "");
  }

  function handleCancelEdit() {
    setEditingId(null);
    setCompany("");
    setPosition("");
    setStatus("Applied");
    setDateApplied("");
    setPlatform("");
    setSourceUrl("");
  }

  const statusOrder = {
    Offer: 1,
    Interview: 2,
    Applied: 3,
    Rejected: 4,
  };

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
    if (sortBy === "status") return statusOrder[a.status] - statusOrder[b.status];

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
            <option value="Offer">Offer</option>
            <option value="Interview">Interview</option>
            <option value="Applied">Applied</option>
            <option value="Rejected">Rejected</option>
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
        company={company}
        setCompany={setCompany}
        position={position}
        setPosition={setPosition}
        status={status}
        setStatus={setStatus}
        dateApplied={dateApplied}
        setDateApplied={setDateApplied}
        handleSubmit={handleSubmit}
        editingId={editingId}
        handleCancelEdit={handleCancelEdit}
        loading={loading}
        platform={platform}
        setPlatform={setPlatform}
        sourceUrl={sourceUrl}
        setSourceUrl={setSourceUrl}
      />

      <ApplicationList
        applications={sortedApplications}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </MainLayout>
  );
}

export default ApplicationsPage;