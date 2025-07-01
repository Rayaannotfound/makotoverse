import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataList = () => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/getData');
      setDataList(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h2>Data List</h2>
      <ul>
        {dataList.map((item) => (
          <li key={item.id}>{item.name}, {item.age}</li>
        ))}
      </ul>
    </div>
  );
};

export default DataList;
