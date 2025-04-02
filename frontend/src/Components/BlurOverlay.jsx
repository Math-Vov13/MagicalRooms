import React from 'react';
import './BlurOverlay.css';
import { Link } from 'react-router';

const BlurOverlay = ({title, link, linktitle}) => {
  return (
    <div className="blur-overlay">
      <div className="content">
        {/* Contenu de l'avant-plan */}
        <h1>{title}</h1>
        <br/><br/><br/>
        <Link to={link}>{linktitle}</Link>
      </div>
    </div>
  );
};

export default BlurOverlay;