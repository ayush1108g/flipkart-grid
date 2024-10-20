import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = () => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const updatedFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        progress: 0,
      })
    );
    setFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="h-screen bg-blue-800 grid place-items-center">
      <div className="bg-blue-600 p-8 rounded-lg shadow-lg w-96">
        <div className="text-white text-xl mb-4">Upload</div>

        <div
          {...getRootProps()}
          className="border-2 border-dashed border-white p-6 rounded-lg text-center text-white mb-4"
        >
          <input {...getInputProps()} />
          <p>
            Drag and drop or <span className="underline">browse</span>
          </p>
        </div>

        <div className="space-y-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white p-2 rounded-lg shadow"
            >
              <div className="flex items-center space-x-2">
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p className="text-sm text-gray-700">{file.name}</p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div>
                {file.progress === 100 ? (
                  <span className="text-green-500">✔</span>
                ) : (
                  <div className="animate-spin text-blue-400">↻</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
