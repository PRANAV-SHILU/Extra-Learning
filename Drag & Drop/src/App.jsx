import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [details, setDetails] = useState([]);

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

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) return;

    setDetails({
      name: file.name,
      path: file.path || file.name,
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate
        ? file.lastModifiedDate.toString()
        : new Date(file.lastModified).toString(),
      size: file.size,
      type: file.type,
      webkitRelativePath: file.webkitRelativePath,
    });

    console.log(file);
  };

  return (
    <div>
      <h1>File Upload</h1>
      <form onSubmit={handleUpload}>
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
            <button
              onClick={() => {
                setFile(null);
                setDetails([]);
                setError("");
              }}
              style={{ marginLeft: 10 }}
            >
              Remove
            </button>
          </div>
        )}

        <button type="submit">Upload</button>
      </form>
      {/* Error UI */}
      {error && <div style={{ marginTop: 10, color: "red" }}>❌ {error}</div>}

      {details && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            border: "1px solid #ccc",
            borderRadius: 8,
            background: "#f9f9f9",
            textAlign: "left",
          }}
        >
          <h3>File Details</h3>
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {JSON.stringify(details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
