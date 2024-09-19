import React from 'react';
import '../Styles/instructions.css'; 

class Box3D extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="box">
          <div className="face front">F</div>
          <div className="face back">B</div>
          <div className="face right">R</div>
          <div className="face left">L</div>
          <div className="face top">T</div>
          <div className="face bottom">B</div>
        </div>
      </div>
    );
  }
}

export default Box3D;
