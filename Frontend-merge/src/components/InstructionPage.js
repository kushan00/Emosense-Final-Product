import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../Styles/instructions.css';
import background3DImage from '../images/background.jpg'; // Replace with your own image

const InstructionPage = () => {
  const instructions = [
    "UTILIZE YOUR SMARTWATCH",
    "STAY CONNECTED WITH YOUR HEALTH DATA",
    "END OF THE DAY, PROVIDE YOUR PREVIOUS DATA HERE",
    "PROVIDE FEEDBACK ON YOUR WORK ENVIRONMENT OF TODAY",
    "TAKE CARE OF YOUR MENTAL HEALTH AND OVERALL WELL-BEING",
  ];

  const [selectedInstruction, setSelectedInstruction] = useState(null);

  const handleInstructionClick = (index) => {
    setSelectedInstruction(index);
  };

  return (
    <div className="instruction-container">
      <div className="background">
        <img src={background3DImage} alt="3D Background" />
      </div>
      <br></br>
      <br></br>
      <p className="title">DISCOVER A STRESS-FREE REMOTE WORK EXPERIENCE WITH REMOTE WORK MATE</p>

      <div className="moving-letters">
        <center>
          <span className="letter">R</span> <span className="letter">E</span> <span className="letter">M</span> <span className="letter">O</span> <span className="letter">T</span> <span className="letter">E</span>
          <br></br>
          <span className="letter">W</span> <span className="letter">O</span> <span className="letter">R</span> <span className="letter">K</span>
          <span className="letter">M</span> <span className="letter">A</span> <span className="letter">T</span> <span className="letter">E</span>
        </center>

      </div>
      <br></br>
      <center>
        <p style={{ fontSize: '18px' }}>Welcome to Remote Work Mate, your dedicated partner in conquering the challenges of remote work while prioritizing your well-being</p>
        <p style={{ fontSize: '18px' }}>In today's fast-paced world, remote employees often face the pressure of balancing productivity with personal life.</p>
        <p style={{ fontSize: '18px' }}>Our platform is here to support you every step of the way.
          We've crafted a system designed to help you release stress, stay connected, and maintain a healthy work-life balance.</p>
        <p style={{ fontSize: '18px' }}>With our innovative tools and resources, you'll be able to take control of your remote work journey.
          This ensures that you can thrive both professionally and personally.</p>
        <p style={{ fontSize: '18px' }}>Let us be your trusted companion in creating a harmonious, stress-free, and successful remote work experience.</p>
      </center>

      <div className="instructions">
        <div className="instruction-box-container">
          {instructions.map((instruction, index) => (
            <div
              key={index}
              className={`instruction-box ${selectedInstruction === index ? "selected" : ""}`}
              onClick={() => handleInstructionClick(index)}
            >
              {instruction}
            </div>
          ))}
        </div>
      </div>
      <div className="navigate-button-container">
        <Link to="/form">
          <center>
            <button className="navigate-button" style={{
              backgroundColor: '#3E8FB5',
              height: '40%',
              width: '250%',
              color: 'black',
              fontWeight: 'bold',
              fontSize: '14px',
              border: '1px solid #000', // Replace #000 with the color you want
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '100px',
              left: '50%',  // Center horizontally
              transform: 'translate(-50%, -50%)', // Center the button
              fontFamily:'initial',
              fontWeight:'bold'


            }}> GO TO NEXT</button>
          </center>
        </Link>
      </div>
    </div>
  );
};

export default InstructionPage;
