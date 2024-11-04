// UnfollowerTracker.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import html_icon from "../assets/img/html.svg";
import FileUpload from "./FileUpload";
import SimpleCarousel from "./Carousel"; // Ensure you have appropriate styles
import slide1 from "../assets/img/slide1.png";
import slide2 from "../assets/img/slide2.png";
import slide3 from "../assets/img/slide3.png";

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

    // Dummy images
    const dummyImages = [
        slide1,
        slide2,
        slide3,
    ];

    return (
        <div className="unfollowerTracker">
            <h1 className="title">Unfollower Tracker</h1>

            {/* Carousel Section */}
            <SimpleCarousel images={dummyImages} />

            {/* File Upload Section */}
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

UnfollowerTracker.propTypes = {
    // Define your prop types if any
};

export default UnfollowerTracker;
