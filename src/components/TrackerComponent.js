import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const UnfollowerTracker = () => {
    const [files, setFiles] = useState([]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => ({
                ...file,
                preview: URL.createObjectURL(file)
            })));
        },
        maxSize: 25000000
    });

    const fileUploadProgress = (file) => {
        // Simulated progress, integrate with actual upload logic
        return 100; // Assuming files are fully uploaded for display
    };

    return (
        <div className="unfollowerTracker">
            <h1 className="title">Unfollower Tracker</h1>
            <div className="carouselIndicator">
                <span className="carouselDot"></span>
                <span className={`carouselDot carouselDotActive`}></span>
                <span className="carouselDot"></span>
            </div>
            <div {...getRootProps()} className="uploadArea">
                <input {...getInputProps()} />
                <p>Click to Upload or drag and drop (Max. File size: 25 MB)</p>
            </div>
            <div className="fileList">
                {files.map((file, index) => (
                    <div key={index} className="fileProgress">
                        <span>{file.name}</span>
                        <progress value={fileUploadProgress(file)} max="100" className="progressBar"></progress>
                    </div>
                ))}
            </div>
            <button disabled={files.length === 0} onClick={() => console.log('Analyze')} className="analyzeButton">
                Analyze
            </button>
        </div>
    );
};

export default UnfollowerTracker;
