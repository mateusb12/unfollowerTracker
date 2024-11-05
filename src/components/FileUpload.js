import React, { useState, useCallback, useEffect } from 'react';
import upload_icon from '../assets/img/upload-icon.svg';
import html_icon from '../assets/img/html.svg';

// Utility function to format bytes
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = [
        'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const dm = decimals < 0 ? 0 : decimals;
    return (
        parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    );
};

const maxFileSize = 25 * 1024 * 1024; // Max file size in bytes (25 MB)
const timePerMB = 5000;
const initialFileProperties = {
    progress: 0,
    complete: false,
};

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [showDragArea, setShowDragArea] = useState(true);
    const [error, setError] = useState(''); // State for error messages

    // Helper function to validate file type
    const isHtmlFile = (file) => {
        const fileType = file.type;
        const fileName = file.name;
        return (
            fileType === 'text/html' ||
            fileName.toLowerCase().endsWith('.html')
        );
    };

    const onFileDrop = useCallback((e) => {
        e.preventDefault();
        setError(''); // Reset any existing errors
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            if (!isHtmlFile(droppedFile)) {
                setError('Invalid file type. Please upload an .html file.');
                return;
            }
            if (droppedFile.size > maxFileSize) {
                setError(`File size exceeds the maximum limit of ${formatBytes(maxFileSize)}.`);
                return;
            }
            setFile({
                ...initialFileProperties,
                file: droppedFile,
                name: droppedFile.name,
                size: droppedFile.size,
            });
            setShowDragArea(false);
        }
    }, []);

    const onFileChange = (e) => {
        setError(''); // Reset any existing errors
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (!isHtmlFile(selectedFile)) {
                setError('Invalid file type. Please upload an .html file.');
                return;
            }
            if (selectedFile.size > maxFileSize) {
                setError(`File size exceeds the maximum limit of ${formatBytes(maxFileSize)}.`);
                return;
            }
            setFile({
                ...initialFileProperties,
                file: selectedFile,
                name: selectedFile.name,
                size: selectedFile.size,
            });
            setShowDragArea(false);
        }
    };

    const handleCancelUpload = () => {
        setFile(null);
        setShowDragArea(true);
        setError(''); // Clear any errors when cancelling
    };

    useEffect(() => {
        if (file && !file.complete) {
            const sizeMB = file.size / (1024 * 1024);
            const totalTime = timePerMB * sizeMB;
            const intervalTime = 200;
            const totalIntervals = Math.ceil(totalTime / intervalTime);
            const increment = 100 / totalIntervals;

            const interval = setInterval(() => {
                setFile((prevFile) => {
                    if (prevFile && prevFile.progress < 100) {
                        const newProgress = prevFile.progress + increment;
                        return {
                            ...prevFile,
                            progress: Math.min(newProgress, 100),
                            complete: newProgress >= 100,
                        };
                    }
                    return prevFile;
                });
            }, intervalTime);

            return () => clearInterval(interval);
        }
    }, [file]);

    return (
        <div className="file-container">
            {showDragArea && (
                <div
                    className="drag-area"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onFileDrop}
                    onClick={() => document.getElementById('fileInput').click()}
                >
                    <img
                        src={upload_icon}
                        alt="Upload Icon"
                        className="upload-icon"
                    />
                    <div className="purple-tag">
                        <span>Click to Upload</span> or drag and drop
                    </div>
                    <div className="max-size-text">
                        (Max. File size: {formatBytes(maxFileSize)})
                    </div>
                </div>
            )}
            <input
                type="file"
                id="fileInput"
                onChange={onFileChange}
                className="hidden-input"
                accept=".html, text/html" // Restrict file types in the dialog
            />
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            {file && (
                <div className="file-entry meta-data-container">
                    {file.complete && (
                        <button
                            className="close-button"
                            onClick={handleCancelUpload}
                        >
                            X
                        </button>
                    )}
                    {file.progress < 100 && (
                        <progress
                            value={file.progress}
                            max="100"
                            className="progress progress-color"
                        ></progress>
                    )}
                    {file.complete && (
                        <div className="file-entry-text meta-data-box">
                            <img
                                src={html_icon}
                                alt="HTML Icon"
                                className="html-icon"
                            />
                            <div>
                                <strong>{file.name}</strong> - {formatBytes(file.size)}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileUpload;