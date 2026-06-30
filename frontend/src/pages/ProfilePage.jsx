import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { openProfileCv, uploadProfileCv } from "../services/api";

function ProfilePage() {
  const [primaryCv, setPrimaryCv] = useState(null);
  const [secondaryCv, setSecondaryCv] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleUpload(cvType, file) {
    if (!file) {
      return;
    }

    try {
      await uploadProfileCv(cvType, file);
      setMessage(`${cvType} CV uploaded successfully.`);
      setError("");
    } catch {
      setError("Could not upload CV.");
      setMessage("");
    }
  }

  return (
    <MainLayout>
      <section>
        <h2>Profile</h2>
        <p>Manage your CVs.</p>

        {message && <p>{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="cv-section">
          <h3>Primary CV</h3>

          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setPrimaryCv(event.target.files[0])}
          />

          <button onClick={() => handleUpload("primary", primaryCv)}>
            Upload primary CV
          </button>

          <button onClick={() => openProfileCv("primary")}>
            View primary CV
          </button>
        </div>

        <div className="cv-section">
          <h3>Secondary CV</h3>

          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setSecondaryCv(event.target.files[0])}
          />

          <button onClick={() => handleUpload("secondary", secondaryCv)}>
            Upload secondary CV
          </button>

          <button onClick={() => openProfileCv("secondary")}>
            View secondary CV
          </button>
        </div>
      </section>
    </MainLayout>
  );
}

export default ProfilePage;