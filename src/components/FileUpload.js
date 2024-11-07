import React, { useState, useCallback, useEffect } from 'react';
import upload_icon from '../assets/img/upload-icon.svg';
import JSZip from 'jszip';
import zip_icon from '../assets/img/zip.png';
import PropTypes from "prop-types";

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

const extractInstagramData = (htmlContent) => {
    // Create a temporary DOM element to parse the HTML string
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlContent;

    // Helper function to extract usernames based on a specific class name
    const extractUsernames = (className) => {
        return Array.from(tempElement.getElementsByClassName(className))
            .map(div => div.querySelector('a')?.textContent.trim().replace('@', ''))
            .filter(Boolean);
    };

    // Extract followers and following lists
    const followers = extractUsernames('_a6-p');  // Replace with actual class name for followers
    const following = extractUsernames('_a705');  // Replace with actual class name for following

    return { followers, following };
};

const maxFileSize = 25 * 1024 * 1024; // Max file size in bytes (25 MB)
const timePerMB = 5000;
const initialFileProperties = {
    progress: 0,
    complete: false,
};

const FileUpload = ({ onFileUploaded }) => {
    const [file, setFile] = useState(null);
    const [showDragArea, setShowDragArea] = useState(true);
    const [error, setError] = useState(''); // State for error messages
    const [htmlFiles, setHtmlFiles] = useState([]); // State to store extracted HTML files

    // Helper function to validate zip files
    const isZipFile = (file) => {
        const fileType = file.type;
        const fileName = file.name.toLowerCase();
        return (
            fileType === 'application/zip' ||
            fileType === 'application/x-zip-compressed' ||
            fileName.endsWith('.zip')
        );
    };

    const onFileDrop = useCallback((e) => {
        e.preventDefault();
        setError('');
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            if (!isZipFile(droppedFile)) {
                setError('Invalid file type. Please upload a .zip file.');
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
        setError('');
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (!isZipFile(selectedFile)) {
                setError('Invalid file type. Please upload a .zip file.');
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
        setHtmlFiles([]);
        setShowDragArea(true);
        setError('');
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

    useEffect(() => {
        // This effect runs when the file upload is complete
        const processZipFile = async () => {
            if (file && file.complete) {
                onFileUploaded(file);
                try {
                    const reader = new FileReader();
                    reader.onload = async (event) => {
                        const arrayBuffer = event.target.result;
                        const zip = await JSZip.loadAsync(arrayBuffer);
                        const htmlFilesPromises = [];
                        const desiredHtmlNames = ['followers', 'following'];

                        zip.forEach((relativePath, zipEntry) => {
                            const fileName = zipEntry.name.toLowerCase();
                            const fileBaseName = fileName.split('/').pop();
                            if (!desiredHtmlNames.some(keyword => fileBaseName.includes(keyword))) {
                                return;
                            }
                            if (zipEntry.name.endsWith('.html')) {
                                htmlFilesPromises.push(
                                    zipEntry.async('string').then((content) => ({
                                        name: zipEntry.name,
                                        content,
                                    }))
                                );
                            }
                        });

                        const extractedHtmlFiles = await Promise.all(htmlFilesPromises);
                        setHtmlFiles(extractedHtmlFiles);

                        // Process each HTML file as needed
                        extractedHtmlFiles.forEach((file) => {
                            const instagramData = extractInstagramData(file.content);
                            // console.log(`File: ${file.name}`);
                            // console.log('Followers:', instagramData.followers);
                            // console.log('Following:', instagramData.following);
                            // Additional processing if needed
                        });
                    };
                    reader.onerror = (event) => {
                        console.error('Error reading file:', event.target.error);
                        setError('Failed to read the uploaded file.');
                    };
                    reader.readAsArrayBuffer(file.file);
                } catch (err) {
                    console.error('An unexpected error occurred:', err);
                    setError('An unexpected error occurred while processing the file.');
                }
            }
        };

        processZipFile();
    }, [file, onFileUploaded]);

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
                accept=".zip, application/zip"
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
                                src={zip_icon}
                                alt="ZIP Icon"
                                className="html-icon"
                            />
                            <div>
                                <strong>{file.name}</strong> - {formatBytes(file.size)}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {htmlFiles.length > 0 && (
                <div className="html-files-list">
                    <h3>Extracted HTML Files</h3>
                    <ul>
                        {htmlFiles.map((htmlFile, index) => (
                            <li key={index}>
                                <strong>{htmlFile.name.split('/').pop()}</strong>
                                {/* Display or process the content as needed */}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

FileUpload.propTypes = {
    onFileUploaded: PropTypes.func.isRequired, // Define prop type
};

export default FileUpload;
