import React from "react";
import "../styling/room.css";
import Tooltip from "./Tooltip.tsx";

const MyRoom = () => {
  return (
    <div class="containerroom">
      <Tooltip />
      <div class="card">
        <div class="tools">
          <div class="circle">
            <span class="red box"></span>
          </div>
          <div class="circle">
            <span class="yellow box"></span>
          </div>
          <div class="circle">
            <span class="green box"></span>
          </div>
          <Tooltip />
        </div>
        <div class="card__content">
          <h1>Welcome to my room</h1>
          <p> This page is still pending...come check again soon</p>
        </div>
        <br></br>
        <div class="brick one"></div>
        <div class="tooltip-mario-container">
          <div class="box"></div>
          <div class="mush"></div>
        </div>
        <Tooltip />
        <div class="brick two"></div>
      </div>

      <div class="card-client">
        <div class="user-picture">
          <svg viewBox="0 0 448 512" xmlns="../logo.svg">
            <path d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"></path>
          </svg>
        </div>
        <p class="name-client">
          {" "}
          Makoto of the Golden Order
          <span>Soon to be Elden Lord</span>
        </p>
      </div>
      <Tooltip />
      <br></br>

      <div class="coolcard">
        <div class="first-content">
          <span>Hero Build</span>
        </div>
        <div class="second-content">
          <span>Villain Build</span>
        </div>
      </div>
      <div>
        <Tooltip />
      </div>
    </div>
  );
};

export default MyRoom;
