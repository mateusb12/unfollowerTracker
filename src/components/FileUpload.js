import React, { useState, useCallback, useEffect } from 'react';
import upload_icon from '../assets/img/upload-icon.svg';
import html_icon from '../assets/img/html.svg';

const containerStyle = {
    width: '35%',
    margin: 'auto',
    fontFamily: 'Hind, sans-serif',
    fontSize: '22px'
};

const dragAreaStyle = {
    position: 'relative',
    padding: '20px',
    cursor: 'pointer',
    border: '2px dashed #CACACA',
    backgroundClip: 'padding-box',
    backgroundImage: 'linear-gradient(gray 45deg, gray 45deg), linear-gradient(gray 135deg, gray 135deg), linear-gradient(gray -45deg, gray -45deg), linear-gradient(gray -135deg, gray -135deg)',
    backgroundSize: '1px 100%, 100% 1px, 1px 100%, 100% 1px',
    backgroundPosition: '0 0, 0 0, 100% 0, 0 100%',
    backgroundRepeat: 'repeat-x, repeat-y, repeat-x, repeat-y',
    color: '#888',
    textAlign: 'center',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    transition: 'border 0.3s ease'
};

const dragAreaHoverStyle = {
    border: '2px solid #CACACA'
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
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
};

const fileEntryTextStyle = {
    margin: '5px 0',
    color: '#333'
};

const progressStyle = {
    width: '100%',
    height: '20px',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none'
};

const progressColorStyle = {
    backgroundColor: '#fbfbfb'
};

const hiddenInputStyle = {
    display: 'none'
};

const closeButtonStyle = {
    cursor: 'pointer',
    padding: '5px 10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    marginLeft: 'auto'
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
const timePerMB = 1000; // 1 second per MB in milliseconds

const initialFileProperties = {
    progress: 0,
    complete: false
};

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [showDragArea, setShowDragArea] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const onFileDrop = useCallback((e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile({
                ...initialFileProperties,
                file: droppedFile,
                name: droppedFile.name,
                size: droppedFile.size,
            });
            setShowDragArea(false); // Hide drag area after file drop
        }
    }, []);

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile({
                ...initialFileProperties,
                file: selectedFile,
                name: selectedFile.name,
                size: selectedFile.size,
            });
            setShowDragArea(false); // Hide drag area after file selection
        }
    };

    const handleCancelUpload = () => {
        setFile(null);
        setShowDragArea(true);
    };

    useEffect(() => {
        if (file && !file.complete) {
            const interval = setInterval(() => {
                setFile((prevFile) => {
                    if (prevFile && prevFile.progress < 100) {
                        const increment = (10 / (prevFile.size / (1024 * 1024))) * (timePerMB / 200);
                        return {
                            ...prevFile,
                            progress: Math.min(prevFile.progress + increment, 100),
                            complete: prevFile.progress + increment >= 100,
                        };
                    }
                    return prevFile;
                });
            }, 200);

            return () => clearInterval(interval);
        }
    }, [file]);

    return (
        <div style={containerStyle}>
            {showDragArea && (
                <div
                    className="drag-area"
                    style={{ ...dragAreaStyle, ...(isHovered ? dragAreaHoverStyle : {}) }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onFileDrop}
                    onClick={() => document.getElementById('fileInput').click()}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <img src={upload_icon} alt="Upload Icon" style={{ width: '60px', height: '60px' }} />
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
                onChange={onFileChange}
                style={hiddenInputStyle}
            />
            {file && (
                <div style={fileEntryStyle} className="meta-data-container">
                    <button style={closeButtonStyle} onClick={handleCancelUpload}>X</button>
                    {file.progress < 100 && (
                        <progress value={file.progress} max="100" style={{ ...progressStyle, ...progressColorStyle }}></progress>
                    )}
                    {file.complete && (
                        <div style={fileEntryTextStyle} className="meta-data-box">
                            <img src={html_icon} alt="HTML Icon" style={{ width: '60px', height: '60px' }} />
                            <div><strong>{file.name}</strong> - {formatBytes(file.size)}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
