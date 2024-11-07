// UnfollowerTracker.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
import mobile8 from "../assets/img/mobile-step-8.jpg";
import mobile9 from "../assets/img/mobile-step-9.jpg";
import mobile10 from "../assets/img/mobile-step-10.jpg";

const UnfollowerTracker = () => {
    const [uploadedFile, setUploadedFile] = useState(null);

    const handleFileUploaded = (file) => {
        setUploadedFile(file);
    };

    const handleAnalyze = () => {
        if (uploadedFile && uploadedFile.complete) {
            console.log('Analyze', uploadedFile);
            // Implement your analysis logic here
        } else {
            console.log('File is not complete:', uploadedFile);
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
        mobile7,
        mobile8,
        mobile9,
        mobile10
    ];

    // Determine the state for the button
    const analyzeButtonState = uploadedFile ? 'enabled' : 'disabled';

    return (
        <div className="unfollowerTracker">
            <h1 className="title">Unfollower Tracker</h1>

            {/* Carousel Section */}
            <SimpleCarousel images={dummyImages}/>

            {/* File Upload Section */}
            <FileUpload onFileUploaded={handleFileUploaded}/>
            {uploadedFile && (
                <div className="uploaded-file-info">
                </div>
            )}
            <button
                onClick={handleAnalyze}
                className="analyzeButton" // Simplify className
                disabled={!uploadedFile || !uploadedFile.complete} // Consider file completion
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
