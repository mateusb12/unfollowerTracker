// UnfollowerTracker.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import html_icon from "../assets/img/html.svg";
import FileUpload from "./FileUpload";

const UnfollowerTracker = () => {
    const [uploadedFile, setUploadedFile] = useState(null);

    const handleFileUploaded = (file) => {
        setUploadedFile(file);
    };

    const handleAnalyze = () => {
        if (uploadedFile && uploadedFile.complete) {
            // Implement your analysis logic here using uploadedFile
            console.log('Analyze', uploadedFile);
            // Example: Send the file to an API for processing
        }
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
    };

    return (
        <div className="unfollowerTracker">
            <h1 className="title">Unfollower Tracker</h1>
            <div className="carouselIndicator">
                <span className="carouselDot"></span>
                <span className="carouselDot carouselDotActive"></span>
                <span className="carouselDot"></span>
            </div>
            <FileUpload onFileUploaded={handleFileUploaded} />
            {uploadedFile && (
                <div className="uploaded-file-info">
                    <img src={html_icon} alt="HTML Icon" className="html-icon-small" />
                    <span className="file-name">{uploadedFile.name}</span>
                    <button className="remove-button" onClick={handleRemoveFile}>
                        Remove
                    </button>
                </div>
            )}
            <button
                disabled={!uploadedFile || !uploadedFile.complete}
                onClick={handleAnalyze}
                className="analyzeButton"
            >
                Analyze
            </button>
        </div>
    );
};

export default UnfollowerTracker;
