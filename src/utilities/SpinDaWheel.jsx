import React, { useState, useEffect, useRef } from 'react';
import { Wheel } from 'react-custom-roulette';
import '../styling/button.css';
import '../styling/SpinDaWheel.css';
import { Link } from 'react-router-dom';

export default function SpinDaWheel() {
  const [inputs, setInputs] = useState(['']);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectedValue, setSelectedValue] = useState('');
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);
  const timerRef = useRef(null);

  // Update input values
  const handleInputChange = (idx, value) => {
    const newInputs = [...inputs];
    newInputs[idx] = value;
    setInputs(newInputs);

    // If last input is filled, add a new empty input
    if (idx === inputs.length - 1 && value.trim() !== '') {
      setInputs([...newInputs, '']);
    }
  };

  // Prepare wheel data from non-empty inputs
  const data = inputs
    .filter(option => option.trim() !== '')
    .map(option => ({ option }));

  const handleSpinClick = () => {
    if (data.length === 0) return;
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, timeLeft]);

  const handleStartTimer = () => {
    setTimeLeft(1800);
    setTimerActive(true);
  };

  const handleStopTimer = () => {
    setTimerActive(false);
    clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setTimerActive(false);
      clearInterval(timerRef.current);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Enter wheel options:</div>
        {inputs.map((value, idx) => (
          <input
            key={idx}
            type="text"
            value={value}
            onChange={e => handleInputChange(idx, e.target.value)}
            className="wheel-input"
            style={{
              marginBottom: '0.5rem',
              padding: '0.5rem',
              borderRadius: '5px',
              border: '1px solid #ccc',
              width: '80%',
              fontSize: '1rem'
            }}
            placeholder={`Option ${idx + 1}`}
          />
        ))}
      </div>
     {data.length > 0 && (
  <Wheel
    mustStartSpinning={mustSpin}
    prizeNumber={prizeNumber}
    data={data}
    onStopSpinning={() => {
      setMustSpin(false);
      setSelectedValue(data[prizeNumber]?.option || '');
    }}
  />
)}
      <button className="button-link" onClick={handleSpinClick} disabled={data.length === 0}>
        Spin
      </button>
      {selectedValue && (
        <div>
          <div>Do 30 minutes of: {selectedValue}</div>
          {!timerActive && (
            <button className="button-link" onClick={handleStartTimer}>Start 30-min Timer</button>
          )}
          {timerActive && (
            <div>
              <div className="timer">Time left: {formatTime(timeLeft)}</div>
              <button className="button-link" onClick={handleStopTimer}>Stop Timer</button>
            </div>
          )}
          <button>
          <Link to="/manifestation" className="button-link">
            Manifestation 
            </Link>
            </button>
        </div>
      )}
    </div>
  );
}