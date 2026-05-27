export default function UploadBox({ onUpload, isUploading }) {
  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div className="upload-box">
      <input type="file" accept=".xlsx,.xls,.csv" onChange={handleChange} />
      <button type="button" disabled={isUploading}>{isUploading ? "Uploading..." : "Upload"}</button>
    </div>
  );
}
