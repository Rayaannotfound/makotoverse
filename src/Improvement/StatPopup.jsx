import React, { useState } from "react";

const StatPopup = ({ onClose }) => {
  const definitions = {
    VI: "Vigor can be improved by getting good sleep and eating well",
    ST: "Strength can be increased by doing activities that build muscle such as weight lifting",
    MA: "Magic can be increased by coding or studying",
    AT: "Attunement can be gained by gaining more allies and being more friendly with people, even if they do not reciprocate. Remember, this is just a game.",
    RES: "This allows you to be stronger and less susceptible to anxiety or sadness. You can get this by adopting stronger mindsets",
    EN: "This can be improved by walking, running or just being more athletic",
    INTELLIGENCE:
      "This can be improved via learning new things. This can be done by reading articles, papers or books. Or practicing your skills",
    FAI: "Faith. This can be improved by positivity, affirmations and manifestation. It can also be improved through prayer",
    INS: "This can be improved by learning from experiences and using them in practice. Building a story in your head of the people around you, situations and evaluating your own behaviour too.",
    ARC: "This can be done through networking and taking on new opportunities which allow you to be much more all-rounded.",
    HONOUR:
      "This gives you more Honour when you try to do good, even against the odds.",
    DOM: "This is done by being more assertive and dominating...",
    ECHOES:
      "This is done by creating content to gain money..Expanding your business sort of thing",
    DEX: "This stat can be incremented by being efficient at completing something or by proving diligence in carrying out something",
    LOVE: "This stat is achieved by appreciating the people around you",
  };

  const [visibleStats, setVisibleStats] = useState({});

  const toggleVisibility = (key) => {
    setVisibleStats((prevVisibleStats) => ({
      ...prevVisibleStats,
      [key]: !prevVisibleStats[key],
    }));
  };

  const handleKeyDown = (event, key) => {
    if (event.key === "Enter" || event.key === " ") {
      toggleVisibility(key);
    }
  };

  return (
    <div
      className="popup"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="popup-inner" tabIndex={0}>
        <h2>Stat explanation</h2>
        <ul>
          {Object.entries(definitions).map(([key, value]) => (
            <li className="listitem" key={key}>
              <div
                className="stat-header"
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                tabIndex={0}
                onClick={() => toggleVisibility(key)}
                onKeyDown={(event) => handleKeyDown(event, key)}
              >
                <span
                  style={{
                    marginRight: "10px",
                    transform: visibleStats[key]
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s",
                  }}
                >
                  ▶
                </span>
                <strong>{key}</strong>
              </div>
              {visibleStats[key] && (
                <div className="stat-detail" style={{ marginLeft: "20px" }}>
                  {value}
                </div>
              )}
            </li>
          ))}
        </ul>
        <details>
          <summary> Note:</summary>
          <p>
            {" "}
            This stat page works in a similar way to the game Elden Ring.
            However, the stats are leveled differently here. 100 points is about
            1 point in Elden Ring. 5000 points is about 50 in Elden Ring. 9999
            is about 99 in Elden Ring (maxed out)
          </p>
        </details>
        <button
          className="button-close"
          onClick={onClose}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onClose()}
        >
          Sounds good
        </button>
      </div>
    </div>
  );
};

export default StatPopup;
