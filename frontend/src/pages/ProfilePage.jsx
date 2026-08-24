import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import CvUploadSection from "../components/CvUploadSection";
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

    try {
      await uploadProfileCv(cvType, file);
      await fetchProfile();

      if (cvType === "primary") {
        setPrimaryCv(null);
      } else {
        setSecondaryCv(null);
      }

      setError("");
    } catch {
      toast.error("Could not upload CV.");
    }
  }

  async function handleDelete(cvType) {
    try {
      await deleteProfileCv(cvType);
      await fetchProfile();

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
      <section className="page-section">
        <header className="page-header compact">
          <div><p className="page-kicker">Account</p><h1>Profile</h1><p>Manage the documents you use in your job search.</p></div>
        </header>

        {profile && (
          <p className="profile-email"><span>Signed in as</span><strong>{profile.email}</strong></p>
        )}

        {error && <p className="error-message">{error}</p>}

        <div className="cv-list">
        <CvUploadSection
          title="Primary CV"
          cvType="primary"
          uploaded={profile?.primary_cv_uploaded}
          selectedFile={primaryCv}
          onFileChange={setPrimaryCv}
          onUpload={handleUpload}
          onView={openProfileCv}
          onDelete={setCvToDelete}
        />

        <CvUploadSection
          title="Secondary CV"
          cvType="secondary"
          uploaded={profile?.secondary_cv_uploaded}
          selectedFile={secondaryCv}
          onFileChange={setSecondaryCv}
          onUpload={handleUpload}
          onView={openProfileCv}
          onDelete={setCvToDelete}
        />
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
