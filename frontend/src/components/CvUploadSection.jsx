function CvUploadSection({
  title,
  cvType,
  uploaded,
  selectedFile,
  onFileChange,
  onUpload,
  onView,
  onDelete,
}) {
  return (
    <div className="cv-section">
      <h3>{title}</h3>

      <p>Status: {uploaded ? "Uploaded" : "Not uploaded"}</p>

      <input
        type="file"
        accept="application/pdf"
        onChange={(event) => onFileChange(event.target.files[0])}
      />

      <button onClick={() => onUpload(cvType, selectedFile)}>
        {uploaded ? `Replace ${title.toLowerCase()}` : `Upload ${title.toLowerCase()}`}
      </button>

      {uploaded && (
        <>
          <button onClick={() => onView(cvType)}>View {title.toLowerCase()}</button>

          <button className="button-danger" onClick={() => onDelete(cvType)}>
            Delete {title.toLowerCase()}
          </button>
        </>
      )}
    </div>
  );
}

export default CvUploadSection;
