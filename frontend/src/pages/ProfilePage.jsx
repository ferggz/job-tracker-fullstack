import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getProfile, openProfileCv, uploadProfileCv, deleteProfileCv } from "../services/api";

function ProfilePage() {
  const [primaryCv, setPrimaryCv] = useState(null);
  const [secondaryCv, setSecondaryCv] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
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
      return;
    }

    try {
      await uploadProfileCv(cvType, file);
      await fetchProfile();

      setMessage(`${cvType} CV uploaded successfully.`);
      setError("");
    } catch {
      setError("Could not upload CV.");
      setMessage("");
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <p>Loading profile...</p>
      </MainLayout>
    );
  }

  async function handleDelete(cvType) {
    const confirmed = window.confirm(`Delete ${cvType} CV?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteProfileCv(cvType);
      await fetchProfile();

      setMessage(`${cvType} CV deleted successfully.`);
      setError("");
    } catch {
      setError("Could not delete CV.");
      setMessage("");
    }
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

        {message && <p>{message}</p>}
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

              <button onClick={() => handleDelete("primary")}>
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

              <button onClick={() => handleDelete("secondary")}>
                Delete secondary CV
              </button>
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

export default ProfilePage;