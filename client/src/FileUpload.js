import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Header from "./Header";
import Footer from "./Footer";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility

  // Mock data for table fields
  const mockFileData = (file) => ({
    itemName: file.name.split(".")[0], // Mock item name from file name
    quantity: Math.floor(Math.random() * 10) + 1, // Random quantity between 1 and 10
    manufacturingDate: "2024-01-01", // Mock manufacturing date
    expiryDate: "2025-01-01", // Mock expiry date
    freshness: Math.floor(Math.random() * 100) + "%", // Random freshness percentage
    otherInfo: "Additional details about the item." // Mock other information
  });

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    const updatedFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        progress: 100, // Assume the upload is successful
        data: mockFileData(file) // Add mock data for table fields
      })
    );

    setFiles((prevFiles) => [...prevFiles, ...updatedFiles]);

    if (rejectedFiles.length > 0) {
      alert("Only image files are allowed.");
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/jpg": [],
    },
    multiple: true,
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };

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

          {/* Toggle Button for Pop-Up */}
          <div className="mt-6 text-center">
            <button
              onClick={toggleModal}
              className="bg-yellow-400 text-black font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-yellow-500 transition-all"
            >
              {isModalOpen ? "Hide Results" : "Show Results"}
            </button>
          </div>
        </div>
      </main>

      {/* Results Pop-Up Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-4xl border border-gray-700">
            <h2 className="text-yellow-400 text-xl font-bold text-center mb-4">
              Uploaded File Results
            </h2>

            {/* Scrollable Table for displaying file data */}
            <div className="overflow-x-auto overflow-y-auto max-h-96">
              <table className="min-w-full table-auto bg-gray-800 text-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-yellow-400">Item Name</th>
                    <th className="px-4 py-2 text-yellow-400">Quantity</th>
                    <th className="px-4 py-2 text-yellow-400">Manufacturing Date</th>
                    <th className="px-4 py-2 text-yellow-400">Expiry Date</th>
                    <th className="px-4 py-2 text-yellow-400">Freshness</th>
                    <th className="px-4 py-2 text-yellow-400">Other Information</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, index) => (
                    <tr key={index} className="border-t border-gray-700">
                      <td className="px-4 py-2 text-center">{file.data.itemName || "-"}</td>
                      <td className="px-4 py-2 text-center">{file.data.quantity || "-"}</td>
                      <td className="px-4 py-2 text-center">{file.data.manufacturingDate || "-"}</td>
                      <td className="px-4 py-2 text-center">{file.data.expiryDate || "-"}</td>
                      <td className="px-4 py-2 text-center">{file.data.freshness || "-"}</td>
                      <td className="px-4 py-2 text-center">{file.data.otherInfo || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Close Button */}
            <div className="text-center mt-6">
              <button
                onClick={toggleModal}
                className="bg-yellow-400 text-black font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-yellow-500 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FileUpload;
