import React, { useState, useEffect } from 'react';
import '../styling/VideoModal.css'; 
import persona3 from '../photos/persona-3.mp4';

const VideoModal = () => {
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      const currentHour = new Date().getHours();
      if (currentHour >= 0 && currentHour < 2) {
        setIsVisible(true);
      }
    }, []);
  
    const handleVideoEnd = () => {
      setIsVisible(false);
    };
  
    if (!isVisible) return null;

    return (
        <div className="video-modal">
          <video autoPlay onEnded={handleVideoEnd} width="100%" height="auto">
            <source src={persona3} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    };

export default VideoModal;
