import React, { useState } from 'react';

function CustomFileButton() {
    const [selectedFileName, setSelectedFileName] = useState(null);

    const handleButtonClick = () => {
      const fileInput = document.getElementById('fileInput');
      if (fileInput) {
        fileInput.click();
      }
    };
  
    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
  
      if (selectedFile) {
        setSelectedFileName(selectedFile.name);
      } else {
        setSelectedFileName(null);
      }
    };
  
    return (
      <div>
        <button onClick={handleButtonClick}>Select a File</button>
        {selectedFileName && <span>{selectedFileName}</span>}
        <input
          type="file"
          id="fileInput"
          accept=".jpg, .png, .pdf"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    );
  
}

export default CustomFileButton;
