import CreateStatModal from "./CreateStats";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";


const Stats = () => {
  const [stats, setStats] = useState([]); 
  const [inputs, setInputs] = useState({});
  const [showPopup, setShowPopup] = useState(false);
   const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem("token");

  axios.get("http://localhost:5000/api/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(({ data }) => {
      
      const rows = data.map(r => ({
        statName: r.statName,
        points: Number(String(r.points).replace(/,/g, "")) || 0,
      }));
      setStats(rows);
      setInputs(Object.fromEntries(rows.map(r => [r.statName, ""])));
    })
    .catch(err => console.error("Error fetching stats", err));
}, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target; 
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    const current = Object.fromEntries(stats.map(s => [s.statName, s.points]));
    const payload = Object.fromEntries(
      Object.entries(inputs)
        .filter(([, v]) => v !== "" && v != null)
        .map(([name, v]) => [name, (Number(current[name]) || 0) + Number(v)])
    );

    if (Object.keys(payload).length === 0) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/update-stats", payload, { headers: {
      Authorization: `Bearer ${token}`, 
    },});

      
      setStats(prev =>
        prev.map(s =>
          payload[s.statName] != null ? { ...s, points: payload[s.statName] } : s
        )
      );

      
      setInputs(prev => Object.fromEntries(Object.keys(prev).map(k => [k, ""])));
    } catch (err) {
      console.error("Error posting updated stats:", err);
    }
  };

  
  const pointsByName = useMemo(
    () => Object.fromEntries(stats.map(s => [s.statName, s.points])),
    [stats]
  );
  const avg = (names) =>
    (names.reduce((sum, n) => sum + (Number(pointsByName[n]) || 0), 0) / names.length).toFixed(2);

  return (
    <div className="statsback">

       <button className="button-link" onClick={() => setShowCreate(true)}>+ Create Stat</button>
      <div className="container">
      

        <form onSubmit={handleSubmit} className="stats-form">
       <div className="stats-grid">


  {stats.map((stat) => (
    <React.Fragment key={stat.statName}>
      <div className="stat-label">{stat.statName}</div>
      <label className="stat-points">
        {Number(stat.points).toLocaleString()}
      </label>
      <input
        className="input stat-input"   
        type="number"
        name={stat.statName}
        value={inputs[stat.statName] ?? ""}
        onChange={handleInputChange}
        placeholder="0"
        min={0}
        step={1}
      />
    </React.Fragment>
  ))}
</div>


          <p>DARKNESS: {avg(["DOM", "RES", "VI", "ARC", "INS"])}</p>
          <p>HERO: {avg(["AT", "ARC", "HONOUR", "INS", "DOM", "LOVE"])}</p>
          <p>HEALTH: {avg(["VI", "ST", "EN", "RES", "LOVE", "HONOUR"])}</p>
          <p>KNOWLEDGE: {avg(["MA", "INTELLIGENCE", "FAI"])}</p>

          <button type="submit">Update Stats</button>
        </form>

    
      </div>

       <CreateStatModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(newStat) => {
        
          setStats(prev => [...prev, { statName: newStat.statName, points: 0 }]);
        }}
      />
    </div>
  );
};

export default Stats;
