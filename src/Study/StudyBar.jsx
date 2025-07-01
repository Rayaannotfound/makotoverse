import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faComments, faUserSecret } from '@fortawesome/free-solid-svg-icons';

import '../styling/sidebar.css';

const StudyBar = ()=> {
  return (
    <div className="sidebar">
      <Link to="/study/notes">
        <FontAwesomeIcon icon={faHome} />
        Create new Study
      </Link>
      <Link to="/study/all">
        <FontAwesomeIcon icon={faComments} />
        See all Study
      </Link>
      <Link to="/study/flashcards">
        <FontAwesomeIcon icon={faUserSecret} />
        Flashcards
      </Link>
    </div>
  );
}

export default StudyBar;
