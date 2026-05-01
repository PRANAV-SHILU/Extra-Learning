import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError("");

    if (fileRejections.length > 0) {
      setFile(null);
      setError("Only PDF/DOC/DOCX under 5MB allowed");
      return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    // maxSize: 5 * 1024 * 1024, // 5MB
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],  
    },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #aaa",
          padding: "30px",
          textAlign: "center",
          cursor: "pointer",
          borderRadius: "10px",
          background: isDragActive ? "#f0f8ff" : "#fff",
        }}
      >
        <input {...getInputProps()} />

        {isDragActive ? (
          <p>Drop resume here…</p>
        ) : (
          <p>Drag & drop resume or click to upload</p>
        )}
      </div>

      {/* Success UI */}
      {file && (
        <div style={{ marginTop: 10 }}>
          ✅ Uploaded: <strong>{file.name}</strong>
          <button onClick={() => setFile(null)} style={{ marginLeft: 10 }}>
            Remove
          </button>
        </div>
      )}

      {/* Error UI */}
      {error && <div style={{ marginTop: 10, color: "red" }}>❌ {error}</div>}
    </div>
  );
}
