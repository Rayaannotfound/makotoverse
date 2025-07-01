import React, { useState } from "react";
import axios from "axios";
import "../styling/title.css";
import "../styling/newsform.css";
const SubmitNews = (props) => {
  const [Heading, setHeading] = useState("");
  const [Information, setInformation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/addNewsData", {
        Heading,
        Information,
      });

      setHeading("");
      setInformation("");
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };
  return (
    <div className="newsback">
      <div class="form-container">
        <h1> Add an article</h1>
        <form onSubmit={handleSubmit} class="form">
          <textarea
            placeholder="Heading"
            cols="36"
            value={Heading}
            name="email"
            id="email"
            onChange={(e) => setHeading(e.target.value)}
          />
          <br></br>
          <textarea
            placeholder="Information"
            rows="25"
            cols="70"
            value={Information}
            onChange={(e) => setInformation(e.target.value)}
          />
          <button type="submit" class="form-submit-btn">
            Submit
          </button>
        </form>
      </div>
      {props.component}
    </div>
  );
};
export default SubmitNews;
