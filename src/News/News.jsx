import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styling/title.css";

const News = (props) => {
  const currentURL = window.location.href.replace(
    "http://localhost:3000/news/",
    ""
  );
  const [data, setData] = useState([]);

  useEffect(() => {
    const ID = currentURL;
    axios
      .get(`http://localhost:5000/api/getNews/ID=${ID}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="thisnews">
      <div className="centered-div">
        <h1>News</h1>
        {data.map((item) => (
          <div>
            <h2>{item.Heading}</h2>
            <p>{item.Information}</p>
          </div>
        ))}
      </div>
      {props.component}
    </div>
  );
};

export default News;
