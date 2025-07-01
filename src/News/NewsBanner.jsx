import React, { useState, useEffect } from "react";
import "../styling/title.css";
import "../styling/button.css";
import "../styling/NewsBanner.css";
import axios from "axios";

const NewsBanner = () => {
  const [data, setData] = useState([]);


  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/getLatestNews`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <div className="news-banner">
      <div className="news-text">
        {data.map((item, value) => (
          <p>
            {item.Heading}: {item.Information}
          </p>
        ))}

      </div>
    </div>
  );
};
export default NewsBanner;
