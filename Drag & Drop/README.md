# Drag & Drop File Upload in React

This project demonstrates how to implement a drag-and-drop file upload feature in a React application using the `react-dropzone` library.

## Libraries Used
- **`react-dropzone`**: A simple React hook to create an HTML5-compliant drag-and-drop zone for files.

## Step-by-Step Implementation Guide

### 1. Installation
Install the necessary dependency:
```bash
npm install react-dropzone
```

### 2. Import the Hook
In your component (e.g., `App.jsx`), import the `useDropzone` hook from the library.
```jsx
import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
```

### 3. Setup `useDropzone` Hook
Define the `onDrop` callback to handle both accepted and rejected files. Configure the hook with options like `multiple`, `maxFiles`, and `accept` to restrict file types.
```jsx
const onDrop = useCallback((acceptedFiles, fileRejections) => {
  setError(""); // Clear previous errors

  if (fileRejections.length > 0) {
    setFile(null);
    setError("Only PDF/DOC/DOCX under 5MB allowed");
    return;
  }

  if (acceptedFiles.length > 0) {
    setFile(acceptedFiles[0]); // Save the accepted file to state
  }
}, []);

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  multiple: false, // Only allow one file at a time
  maxFiles: 1,
  accept: {
    "application/pdf": [".pdf"],
    "application/msword": [".doc", ".docx"],
  },
});
```

### 4. Render the Dropzone UI
Use `getRootProps` and `getInputProps` (returned from the hook) to bind the dropzone functionality to your UI elements. You can conditionally style the dropzone using `isDragActive`.
```jsx
<div
  {...getRootProps()}
  style={{
    border: "2px dashed #aaa",
    padding: "30px",
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
```

### 5. Access File Details & Form Submission
Once a file is selected or dropped, it's stored in your component state. You can access its properties (like name, size, type) and handle the form submission.
```jsx
const handleUpload = (e) => {
  e.preventDefault();
  if (!file) return;

  // Extract file details for preview or upload
  const fileDetails = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  };
  
  console.log("File ready for upload:", fileDetails);
};
```
