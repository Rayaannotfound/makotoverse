import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
//import DiscoveryModal from "./CreateDiscovery";
import "../styling/button.css";
import ReactQuill, { Quill } from "react-quill";
import "../styling/discovery.css";
const DiscoveryPage = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  //(data);
  const [disdata, setdisData] = useState([]);

  //(disdata);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/getdiscoveries`)
      .then((response) => {
        setdisData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // This empty array is crucial
  return (
    <div className="backgroundmap">
      <h1> Discovery of Grace</h1>

      <p>
        {" "}
        Come here to see all the different locations discovered thus the making
        of this page
      </p>
      <div>
        {" "}
        <button className="button-link" onClick={() => openModal(true)}>
          Add New Discovery
        </button>
      </div>

      {/* The Discovery Modal */}
      <DiscoveryModal isOpen={isModalOpen} onClose={closeModal} />
      <div className="content">
        <ul>
          {disdata.map((content, index) => (
            <div className="content-item">
              <h2>{content.title}</h2>
              <div className="content-type">
                {" "}
                <h2>{content.description}</h2>
              </div>
              <div dangerouslySetInnerHTML={{ __html: content.photo }} />
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

const DiscoveryModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  //("I opened up!");
  const handleSubmit = async () => {
    try {
      const content = {
        title: title,
        description: description,
        photo: photo,
      };

      await axios.post("http://localhost:5000/api/newdiscovery", {
        content: content,
      });
      //("Content stored successfully");
    } catch (error) {
      console.error("Error storing content:", error);
    }
  };

  if (isOpen) {
    //("I rioc");
  }
  if (!isOpen) return null;
  const formats = [
    "link",
    "image",
    "bold",
    "italic",
    "underline",
    "strike",
    "code",
    "blockquote",
    "list",
    "header",
    "align",
    "color",
    "background",
    "script",
  ];
  return (
    <div
      className="modal-content"
      style={{ display: isOpen ? "block" : "none" }}
    >
      <form onSubmit={handleSubmit}>
        <div class="input-container">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            class="input"
            name="text"
          />
          <label class="label" for="input">
            Enter a Location name
          </label>
          <div class="topline"></div>
          <div class="underline"></div>
        </div>
        <br></br>
        <div class="input-container">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            class="input"
            name="text"
          />
          <label class="label" for="input">
            Location Description
          </label>
          <div class="topline"></div>
          <div class="underline"></div>
        </div>
        <label>
          <br></br>
          Photo:
          <ReactQuill theme="snow" value={photo} onChange={setPhoto} />
        </label>

        <button type="submit">Submit</button>
        <button onClick={onClose}>Close</button>
      </form>
    </div>
  );
};
export default DiscoveryPage;
