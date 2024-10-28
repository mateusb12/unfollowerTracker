import React, { useState, useCallback, useEffect } from 'react';

const containerStyle = {
    width: '35%',
    margin: 'auto',
    fontFamily: 'Hind, sans-serif',
    fontSize: '22px'
};

const purpleTagStyle = {
    color: '#805DAB'
};

const maxSizeTextStyle = {
    fontSize: '16px'
};

const fileEntryStyle = {
    backgroundColor: '#f0f0f0',
    padding: '10px',
    marginBottom: '10px'
};

const fileEntryTextStyle = {
    margin: '5px 0',
    color: '#333'
};

const progressStyle = {
    width: '100%',
    height: '20px'
};

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
            const interval = setInterval(() => {
                setFiles((prevFiles) => {
                    const updatedFiles = prevFiles.map((file) => {
                        if (!file.complete && file.progress < 100) {
                            return {
                                ...file,
                                progress: Math.min(file.progress + 10, 100),
                                complete: file.progress + 10 >= 100,
                            };
                        }
                        return file;
                    });
                    return updatedFiles;
                });
            }, 200);

            return () => clearInterval(interval);
        }
    }, [files.length]);

    return (
        <div style={containerStyle}>
            {showDragArea && (
                <div
                    className="drag-area"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onFileDrop}
                    onClick={() => document.getElementById('fileInput').click()}
                >
                    <div style={purpleTagStyle}>
                        <span>Click to Upload</span> or drag and drop
                    </div>
                    <div style={maxSizeTextStyle}>
                        (Max. File size: {formatBytes(maxFileSize)})
                    </div>
                </div>
            )}
            <input
                type="file"
                id="fileInput"
                multiple
                onChange={onFileChange}
                style={{ display: 'none' }}
            />
            {files.map((file, index) => (
                <div key={index} style={fileEntryStyle}>
                    {file.progress < 100 && (
                        <progress value={file.progress} max="100" style={progressStyle}></progress>
                    )}
                    {file.complete && (
                        <p style={fileEntryTextStyle}>
                            <strong>{file.name}</strong> - {formatBytes(file.size)}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FileUpload;
