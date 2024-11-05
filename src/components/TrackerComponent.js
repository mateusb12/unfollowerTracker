// UnfollowerTracker.js
import React, { useState } from 'react';
import html_icon from "../assets/img/html.svg";
import FileUpload from "./FileUpload";
import SimpleCarousel from "./Carousel"; // Ensure you have appropriate styles
import mobile1 from "../assets/img/mobile-step-1.jpg";
import mobile2 from "../assets/img/mobile-step-2.jpg";
import mobile3 from "../assets/img/mobile-step-3.jpg";
import mobile4 from "../assets/img/mobile-step-4.jpg";
import mobile5 from "../assets/img/mobile-step-5.jpg";
import mobile6 from "../assets/img/mobile-step-6.jpg";
import mobile7 from "../assets/img/mobile-step-7.jpg";

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
        mobile1,
        mobile2,
        mobile3,
        mobile4,
        mobile5,
        mobile6,
        mobile7
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
