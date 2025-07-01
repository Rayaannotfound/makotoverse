import React, { useState, useEffect } from "react";
import "../styling/title.css";
import { Link } from "react-router-dom";
import "../styling/button.css";
import "../styling/NewsBanner.css";
import "../styling/news.css";
import axios from "axios";
import NewsWidget from "./NewsWidget";

const AllNews = ({ component }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/getAllNews")
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching data ma so meekaldo :", error));
  }, []);

  return (
    <div>
      {component}
      <div className="allnews">
        <div className="boxes-container">
          {Object.entries(data).map(([key, value]) => (
            <NewsWidget key={key}>
              <Link to={`${value.ID}`} className="text-title">
                {value.Heading}
              </Link>
            </NewsWidget>
          ))}
        </div>
        <Link to="/submitNews">
          <button className="button-link">Create new news</button>
        </Link>
      </div>
    </div>
  );
};

export default AllNews;
