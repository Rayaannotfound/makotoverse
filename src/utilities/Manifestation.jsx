import React, { useState, useRef } from 'react';
import '../styling/manifestation.css';
import rotomImg from '../photos/rotom.png';
import heartImg from '../photos/soul.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const prompts = [
  "What is your goal?",
  "Visualise how you will get there.",
  "Step one to get there:",
  "Step two to get there:",
  "Step three to get there:"
];

const Manifestation = () => {
  const [manifestation, setManifestation] = useState(false);
  const [answers, setAnswers] = useState(Array(prompts.length).fill(''));
  const [currentStep, setCurrentStep] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [manifested, setManifested] = useState(false);
  const timerRef = useRef(null);

  const handleInputChange = (idx, value) => {
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (answers[idx].trim() === '') return; // Don't proceed if empty
      if (idx < prompts.length - 1) {
        setCurrentStep(idx + 1);
      } else {
        setShowHeart(true);
      }
    }
  };

  const handleHeartMouseDown = () => {
    timerRef.current = setTimeout(() => {
      setManifested(true);
      toast.success("Manifestation sent!");
    }, 1500);
  };

  const handleHeartMouseUp = () => {
    clearTimeout(timerRef.current);
  };

  return (
    <div className="manifestation-container">
      <div className="manifestation-header">
        <img src={rotomImg} alt="Manifestation Background" width="100px" height="100px" />
        <h1 className="manifestation-title">Manifestation time!!</h1>
      </div>
      <details>
        <summary>Info:</summary>
        <p>
          You play by thinking about something you would like to happen, visualising that thought, planning how you can turn those thoughts into reality, and then you send that energy out to the universe!! The Universe will protect that energy as long as you continue to put energy towards completing that goal you had in mind
        </p>
      </details>
      <button className="manifestation-button" onClick={() => setManifestation(true)}>
        Start Manifestation
      </button>

      {manifestation && (
        <div className="manifestation-content">
          <form>
            {[...Array(currentStep + 1)].map((_, idx) => (
              <div
                key={idx}
                className="manifestation-fadein"
                style={{ animationDelay: '0s' }}
              >
                <label htmlFor={`manifestation-input-${idx}`}>{prompts[idx]}</label>
                <input
                  type="text"
                  id={`manifestation-input-${idx}`}
                  className="manifestation-placement"
                  placeholder={prompts[idx]}
                  value={answers[idx]}
                  onChange={e => handleInputChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  disabled={showHeart}
                  autoFocus={idx === currentStep}
                />
              </div>
            ))}
          </form>
          {showHeart && !manifested && (
            <div style={{ marginTop: '2em', textAlign: 'center' }}>
              <div>Send your energy up!<br />Hold down the heart:</div>
              <img
                src={heartImg}
                alt="Send your energy"
                style={{ width: 120, height: 120, cursor: 'pointer', marginTop: 16 }}
                onMouseDown={handleHeartMouseDown}
                onMouseUp={handleHeartMouseUp}
                onMouseLeave={handleHeartMouseUp}
                draggable={false}
              />
              <div style={{ fontSize: '0.9em', color: '#ffb6d5', marginTop: 8 }}>
                (Hold for 1.5 seconds)
              </div>
            </div>
          )}
          {manifested && (
            <div style={{ marginTop: '2em', color: '#ffb6d5', fontWeight: 'bold' }}>
              🌟 Manifestation sent! 🌟
            </div>
          )}
        </div>
      )}
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default Manifestation;