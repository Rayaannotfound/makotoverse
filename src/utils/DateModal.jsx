// DateModal.js
import React, { useState, useEffect } from 'react';
import '../styling/DataModal.css'; 

const DateModal = () => {
    const [showModal, setShowModal] = useState(false);
  
  
    const formatDate = (date) => {
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        weekday: 'long',
      });
    };
  
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
  
    useEffect(() => {
      const lastVisit = localStorage.getItem('lastVisit');
      const today = new Date().toDateString();
  
      if (!lastVisit || new Date(lastVisit).toDateString() !== today) {
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 3000); 
        localStorage.setItem('lastVisit', today);
      }
    }, []);
 
    return (
      showModal && (
        <div className="dateModal">
          <div className="dateSlideContainer">
            <div className="dateSlide">
                <h1> NEW DATE</h1>
                <p className="white">{formatDate(yesterday)}</p>
                </div>
            <div className="dateSlide"> <h2 className="white">{formatDate(new Date())}</h2>
            </div>
          </div>
        </div>
      )
    );
  };

export default DateModal;
