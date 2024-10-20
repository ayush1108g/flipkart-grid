import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Header from "./Header";
import Footer from "./Footer";

const FileUpload = () => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle accepted files (which are images)
    const updatedFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        progress: 100, // Assume the upload is successful, no actual uploading here
      })
    );

    // Add only accepted image files to the state
    setFiles((prevFiles) => [...prevFiles, ...updatedFiles]);

    // Optionally handle rejected files here
    if (rejectedFiles.length > 0) {
      alert("Only image files are allowed.");
    }
  }, []);

  // Restrict to image files only
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/jpg": [],
    },
    multiple: true, // Allows multiple files
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 via-black to-gray-900 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex justify-center items-center py-12 px-4">
        <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-lg border border-gray-700">
          <div className="text-yellow-400 text-xl font-semibold mb-4 text-center">
            Upload Image Files
          </div>

          {/* File Drop Area */}
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-yellow-400 p-6 rounded-lg text-center mb-4 cursor-pointer hover:bg-gray-700 transition-all"
          >
            <input {...getInputProps()} />
            <p className="text-yellow-400">
              Drag and drop or <span className="underline">browse</span> (Only images allowed)
            </p>
          </div>

          {/* File Preview List */}
          <div className="space-y-4">
            {files.length === 0 ? (
              <p className="text-gray-400 text-center">No image files uploaded yet.</p>
            ) : (
              files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-700 p-2 rounded-lg shadow border border-gray-600"
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <p className="text-sm text-white font-semibold">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div>
                    {file.progress === 100 ? (
                      <span className="text-green-500">✔</span>
                    ) : (
                      <div className="animate-spin text-yellow-500">↻</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FileUpload;
