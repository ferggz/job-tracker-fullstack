import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import MainLayout from "../layouts/MainLayout";
import {
  deleteProfileCv,
  getProfile,
  openProfileCv,
  uploadProfileCv,
} from "../services/api";

function ProfilePage() {
  const [primaryCv, setPrimaryCv] = useState(null);
  const [secondaryCv, setSecondaryCv] = useState(null);
  const [profile, setProfile] = useState(null);
  const [cvToDelete, setCvToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const data = await getProfile();
      setProfile(data);
      setError("");
    } catch {
      setError("Could not load profile.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(cvType, file) {
    if (!file) {
      toast.error("Please select a PDF file.");
      return;
    }

    const replacing =
      cvType === "primary"
        ? profile?.primary_cv_uploaded
        : profile?.secondary_cv_uploaded;

    try {
      await uploadProfileCv(cvType, file);
      await fetchProfile();

      toast.success(
        replacing
          ? `${cvType} CV replaced successfully.`
          : `${cvType} CV uploaded successfully.`,
      );

      setError("");
    } catch {
      toast.error("Could not upload CV.");
    }
  }

  async function handleDelete(cvType) {
    try {
      await deleteProfileCv(cvType);
      await fetchProfile();

      toast.success(`${cvType} CV deleted successfully.`);
      setError("");
      setCvToDelete(null);
    } catch {
      toast.error("Could not delete CV.");
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <p>Loading profile...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section>
        <h2>Profile</h2>
        <p>Manage your CVs.</p>

        {profile && (
          <p>
            Email: <strong>{profile.email}</strong>
          </p>
        )}

        {error && <p className="error-message">{error}</p>}

        <div className="cv-section">
          <h3>Primary CV</h3>

          <p>
            Status:{" "}
            {profile?.primary_cv_uploaded ? "Uploaded" : "Not uploaded"}
          </p>

          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setPrimaryCv(event.target.files[0])}
          />

          <button onClick={() => handleUpload("primary", primaryCv)}>
            {profile?.primary_cv_uploaded
              ? "Replace primary CV"
              : "Upload primary CV"}
          </button>

          {profile?.primary_cv_uploaded && (
            <>
              <button onClick={() => openProfileCv("primary")}>
                View primary CV
              </button>

              <button
                className="button-danger"
                onClick={() => setCvToDelete("primary")}
              >
                Delete primary CV
              </button>
            </>
          )}
        </div>

        <div className="cv-section">
          <h3>Secondary CV</h3>

          <p>
            Status:{" "}
            {profile?.secondary_cv_uploaded ? "Uploaded" : "Not uploaded"}
          </p>

          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setSecondaryCv(event.target.files[0])}
          />

          <button onClick={() => handleUpload("secondary", secondaryCv)}>
            {profile?.secondary_cv_uploaded
              ? "Replace secondary CV"
              : "Upload secondary CV"}
          </button>

          {profile?.secondary_cv_uploaded && (
            <>
              <button onClick={() => openProfileCv("secondary")}>
                View secondary CV
              </button>

              <button
                className="button-danger"
                onClick={() => setCvToDelete("secondary")}
              >
                Delete secondary CV
              </button>
            </>
          )}
        </div>
      </section>

      {cvToDelete && (
        <ConfirmModal
          title={`Delete ${cvToDelete} CV?`}
          message="This action cannot be undone."
          onCancel={() => setCvToDelete(null)}
          onConfirm={() => handleDelete(cvToDelete)}
        />
      )}
    </MainLayout>
  );
}

export default ProfilePage;