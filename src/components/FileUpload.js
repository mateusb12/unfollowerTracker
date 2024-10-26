import React, { useState, useCallback } from 'react';

const FileUpload = () => {
    const [files, setFiles] = useState([]);

    const onFileDrop = useCallback((e) => {
        e.preventDefault();
        const newFiles = Array.from(e.dataTransfer.files).map(file => ({
            file,
            name: file.name,
            size: file.size,
            progress: 0,
            complete: false
        }));
        setFiles(prev => [...prev, ...newFiles]);
    }, []);

    const onFileChange = (e) => {
        const newFiles = Array.from(e.target.files).map(file => ({
            file,
            name: file.name,
            size: file.size,
            progress: 0,
            complete: false
        }));
        setFiles(prev => [...prev, ...newFiles]);
    };

    const uploadFiles = (fileIndex) => {
        const newFiles = [...files];
        const file = newFiles[fileIndex];
        file.progress = 100; // Simulate immediate upload complete
        file.complete = true;
        setFiles(newFiles);
    };

    return (
        <div className="file-uploader-container">
            <div className="drag-area" onDragOver={(e) => e.preventDefault()} onDrop={onFileDrop} onClick={() => document.getElementById('fileInput').click()} style={{ border: '1px solid gray', padding: '20px', cursor: 'pointer' }}>
                Click to Upload or drag and drop (Max. File size: 25 MB)
            </div>
            <input type="file" id="fileInput" multiple onChange={onFileChange} style={{ display: 'none' }} />
            {files.map((file, index) => (
                <div key={index}>
                    <p>{file.name} - {file.size} bytes</p>
                    <progress value={file.progress} max="100"></progress>
                    <button onClick={() => uploadFiles(index)}>Upload</button>
                </div>
            ))}
        </div>
    );
};

export default FileUpload;
