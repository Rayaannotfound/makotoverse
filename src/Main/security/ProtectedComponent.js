import React, { useEffect, useState } from "react";
import axios from "axios";

const ProtectedComponent = () => {
  const [message, setMessage] = useState("");

  const getProtectedContent = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:3001/protected", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Access denied you loser");
    }
  };

  useEffect(() => {
    getProtectedContent();
  }, []);

  return (
    <div>
      <h1>Protected Content</h1>
      <p>{message}</p>
    </div>
  );
};

export default ProtectedComponent;
