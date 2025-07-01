import React from "react";
import "../styling/news.css";
const NewsWidget = ({ children }) => {
  return (
    <div className="blue">
      <div className="newscard">{children}</div>
    </div>
  );
};

export default NewsWidget;
