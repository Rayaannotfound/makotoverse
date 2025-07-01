import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styling/content-list.css";

function ContentList(props) {
  const [contentList, setContentList] = useState([]);

  useEffect(() => {
    fetchContentList();
  }, []);

  const fetchContentList = async () => {
    try {
      const id = window.location.href.replace(
        "http://localhost:3000/study/",
        ""
      );
      const response = await axios.get(
        `http://localhost:5000/api/get-content-list/id=${id}`
      );
      setContentList(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  return (
    <div className="content">
      <ul>
        {contentList.map((content, index) => (
          <div className="content-item">
            {" "}
            <h2>{content.title}</h2>
            <div className="content-type">
              {" "}
              <h2>{content.type}</h2>
            </div>
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          </div>
        ))}
      </ul>
      {props.component}
    </div>
  );
}

export default ContentList;
