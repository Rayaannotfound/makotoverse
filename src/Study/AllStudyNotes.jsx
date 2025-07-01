import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styling/content-list.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { pageTransition, pageVariants } from "../utilities/transitions";

const AllStudyNotes = (props) => {
  const [data, setData] = useState([]);


  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/allstudies`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <div className="allstudy">
      {" "}
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="page"
      >
        <div className="left">
          <div className="boxes-container">
            {Object.entries(data).map(([key, value]) => (
              <div>
                <Link to={`/study/${value.id}`} className="box">
                  {value.title}
                  <p className="text-hidden"> {value.type}</p>
                </Link>
              </div>
            ))}

            {props.component}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default AllStudyNotes;
