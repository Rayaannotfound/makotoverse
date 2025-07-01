import React from "react";
import ReactDOM from "react-dom";
import Tooltip from "./Tooltip.tsx";
import TooltipContent from "./TooltipContent";

const MyRoom = () => {
  return (
    <div style={{ padding: "50px" }}>
      <Tooltip content={TooltipContent} placement="bottom">
        <div className="skibidi"></div>
        <button>Hover over me</button>
      </Tooltip>
      <Tooltip content={TooltipContent} placement="bottom">
        <button>Hover over me</button>
      </Tooltip>
      <Tooltip content={TooltipContent} placement="bottom">
        <button>Hover over me</button>
      </Tooltip>
      <p> Why so serious ahahahehhehe</p>
      <Tooltip content={TooltipContent} placement="bottom">
        <button>Hover over me</button>
      </Tooltip>
      <Tooltip content={TooltipContent} placement="bottom">
        <button>Hover over me</button>
      </Tooltip>
      <Tooltip content={TooltipContent} placement="bottom">
        <button>Hover over me</button>
      </Tooltip>
      <Tooltip content={TooltipContent} placement="bottom">
        <button>Hover over me</button>
      </Tooltip>
      <div style={{ display: "flex", justifyContent: "left" }}>
        <Tooltip content={TooltipContent} placement="bottom">
          <button>Hover over me</button>
        </Tooltip>
        <Tooltip content={TooltipContent} placement="bottom">
          <button>Hover over me</button>
        </Tooltip>
        <Tooltip content={TooltipContent} placement="bottom">
          <button>Hover over me</button>
        </Tooltip>
        <Tooltip content={TooltipContent} placement="bottom">
          <button>Hover over me</button>
        </Tooltip>
        <div style={{ placement: "bottom" }}>
          <Tooltip content={TooltipContent} placement="bottom">
            <button>Hover over me</button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default MyRoom;
