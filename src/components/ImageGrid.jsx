import React, { useState, useRef } from "react";
import "./grid.css";
import { readFileAsBase64, generateImageHash } from "../utils/hashUtils";

const ImageGrid = ({ onPatternChange }) => {
  // We store objects: { cellIndex: 0, fileUrl: "blob:...", hash: "a3f..." }
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);
  const [currentCellIndex, setCurrentCellIndex] = useState(null);

  const rows = ['A', 'B', 'C', 'D'];
  const cols = ['1', '2', '3', '4'];

  // 1. When a cell is clicked, trigger the hidden file input
  const handleCellClick = (index) => {
    // If cell already has an image, remove it (toggle off)
    if (selectedImages.some(img => img.cellIndex === index)) {
      const updated = selectedImages.filter(img => img.cellIndex !== index);
      setSelectedImages(updated);
      onPatternChange(updated); // Send parent the updated list
      return;
    }

    // Check limit (Max 3)
    if (selectedImages.length >= 3) {
      alert("You can only upload 3 images!");
      return;
    }

    // Open File Dialog
    setCurrentCellIndex(index);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input
      fileInputRef.current.click();
    }
  };

  // 2. Handle the File Upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || currentCellIndex === null) return;

    try {
      // Create a preview URL for UI
      const previewUrl = URL.createObjectURL(file);
      
      // Convert to Hash for Database (Storage Efficient)
      const base64 = await readFileAsBase64(file);
      const hash = generateImageHash(base64);

      const newEntry = {
        cellIndex: currentCellIndex,
        fileUrl: previewUrl, // For display only
        hash: hash           // For the database
      };

      const updatedList = [...selectedImages, newEntry];
      setSelectedImages(updatedList);
      onPatternChange(updatedList); // Send to parent

    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image.");
    }
  };

  return (
    <div className="grid-container">
      {/* Hidden File Input */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        style={{ display: "none" }} 
        onChange={handleFileChange}
      />

      {[...Array(16)].map((_, i) => {
        const rowLabel = rows[Math.floor(i / 4)];
        const colLabel = cols[i % 4];
        const cellLabel = `${rowLabel}${colLabel}`;
        
        // Find if this cell has an image
        const cellData = selectedImages.find(img => img.cellIndex === i);

        return (
          <div
            key={i}
            className={`grid-cell ${cellData ? "active" : ""}`}
            onClick={() => handleCellClick(i)}
            style={{
              backgroundImage: cellData ? `url(${cellData.fileUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Show Label only if empty */}
            {!cellData && (
              <>
                <span style={{color: '#cbd5e1', fontSize: '24px'}}>+</span>
                <div className="cell-label">{cellLabel}</div>
              </>
            )}
            
            {/* Show Checkmark if has image */}
            {cellData && <div className="check-overlay">✓</div>}
          </div>
        );
      })}
    </div>
  );
};

export default ImageGrid;