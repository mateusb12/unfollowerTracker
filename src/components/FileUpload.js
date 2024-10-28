import React, { useState, useCallback, useEffect } from 'react';

// Utility function to format bytes
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const dm = decimals < 0 ? 0 : decimals;
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const maxFileSize = 25 * 1024 * 1024; // Max file size in bytes (25 MB)

const initialFileProperties = {
    progress: 0,
    complete: false
};

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [showDragArea, setShowDragArea] = useState(true);

    const onFileDrop = useCallback((e) => {
        e.preventDefault();
        const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
            ...initialFileProperties,
            file,
            name: file.name,
            size: file.size,
        }));
        setFiles((prev) => [...prev, ...newFiles]);
        setShowDragArea(false); // Hide drag area after file drop
    }, []);

    const onFileChange = (e) => {
        const newFiles = Array.from(e.target.files).map((file) => ({
            ...initialFileProperties,
            file,
            name: file.name,
            size: file.size,
        }));
        setFiles((prev) => [...prev, ...newFiles]);
        setShowDragArea(false); // Hide drag area after file selection
    };

    useEffect(() => {
        if (files.length > 0) {
            files.forEach((file, index) => {
                if (!file.complete) {
                    setTimeout(() => {
                        const newFiles = [...files];
                        newFiles[index].progress = 100; // Simulate progress to 100%
                        newFiles[index].complete = true;
                        setFiles(newFiles);
                    }, 1000); // Simulate upload time
                }
            });
        }
    }, [files]);

    return (
        <div className="file-uploader-container">
            {showDragArea && (
                <div
                    className="drag-area"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onFileDrop}
                    onClick={() => document.getElementById('fileInput').click()}
                >
                    <div className="purple-upper-label">
                        <span className="purple-tag">Click to Upload</span> or drag and drop
                    </div>
                    <div className="max-size-text">
                        (Max. File size: {formatBytes(maxFileSize)})
                    </div>
                </div>
            )}
            <input
                type="file"
                id="fileInput"
                multiple
                onChange={onFileChange}
                style={{ display: 'none' }} // Keep this inline or move to CSS
            />
            {files.map((file, index) => (
                <div key={index} className="file-entry">
                    {file.progress < 100 && (
                        <progress value={file.progress} max="100"></progress>
                    )}
                    {file.complete && (
                        <p>
                            <strong>{file.name}</strong> - {formatBytes(file.size)}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FileUpload;
