import { Eye, FileText, Trash2, Upload } from "lucide-react";

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
      <div className="cv-icon" aria-hidden="true"><FileText size={20} /></div>
      <div className="cv-copy">
        <div><h3>{title}</h3><span className={`document-state ${uploaded ? "is-ready" : ""}`}>{uploaded ? "Uploaded" : "Not uploaded"}</span></div>
        <p>{selectedFile ? selectedFile.name : "PDF document"}</p>
      </div>

      <div className="cv-actions">
        <label className="file-picker">
          <span>{selectedFile ? "Change file" : "Choose file"}</span>
          <input type="file" accept="application/pdf" onChange={(event) => onFileChange(event.target.files[0])} />
        </label>
        <button disabled={!selectedFile} onClick={() => onUpload(cvType, selectedFile)}>
          <Upload size={16} />{uploaded ? "Replace" : "Upload"}
        </button>
        {uploaded && <button className="button-secondary" onClick={() => onView(cvType)}><Eye size={16} />View</button>}
        {uploaded && <button className="icon-button danger" aria-label={`Delete ${title.toLowerCase()}`} onClick={() => onDelete(cvType)}><Trash2 size={17} /></button>}
      </div>
    </div>
  );
}

export default CvUploadSection;
