import React, { useState, useRef } from 'react';
import '../Styles/model.css';
import StressGraph from './StressGraph';
import stressReduce from '../images/stressReduce.jpg';
import backgroundMusic from '../images/song.mp3'; // Import your audio file
import { Box, } from '@mui/material'

const Modal = ({
  isOpen,
  onClose,
  stressResult,
  stressLevelResult,
  recommendedTherapy,
  recommendedBenefits,
  isFriday,
  stressData,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);

  const startSpeaking = (text) => {
    if ('speechSynthesis' in window) {
      const synthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);

      // Play the background music
      audioRef.current.play();

      utterance.onend = () => {
        // When speech ends, pause the background music
        audioRef.current.pause();
        setIsSpeaking(false);
      };

      synthesis.speak(utterance);
      setIsSpeaking(true);
    } else {
      alert('Text-to-speech is not supported in this browser.');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      audioRef.current.pause();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Box m='20px'>
      <div className="modal-overlay">
        <div className="modal">
          <span className="close-button" onClick={onClose}>
            &times;
          </span>
          <div>
            <b className="paragraph-3" style={{ fontSize: '20px' }}>YOUR MENTAL HEALTH SHINES WITH CONFIDENCE AND POSITIVITY</b>
          </div>
          <br></br>
          {isFriday ? (
            <div className="grid-container3">
              <div className="highlight-box3">
                <center>
                  <StressGraph stressData={stressData} />
                </center>
              </div>

              <div className="grid-container4">
                <div className="highlight-box4">
                  <br></br>
                  <div className="paragraph-1">
                    <b style={{fontSize:'20px'}}>Unlock Your Potential, Your Confidence Level Is Soaring</b>
                    <p style={{ color: 'red',fontSize:'18px' }}>{(stressResult.confidence * 100).toFixed(2)}%</p>
                  </div>

                  <br></br>
                  <div className="paragraph-1">
                    <b style={{fontSize:'20px'}}>Embrace Restful Nights, Your Sleep Efficiency Forecast is Exceptional</b>
                    <p style={{ color: 'red',fontSize:'18px' }}>{(stressLevelResult.predicted_sleepefficiency * 100).toFixed(2)}%</p>
                  </div>

                  <br></br>
                  <div className="paragraph-1">
                    <b style={{fontSize:'20px'}}>Find Calm Within, Your Stress Analysis Reveals Insights for Serenity</b>
                    <p style={{ color: 'red',fontSize:'18px' }}>{stressLevelResult.predicted_stress.toUpperCase()}</p>
                  </div>
                </div>
              </div>

              <div className="grid-container1">
                <div className="highlight-box1">

                  <b className="paragraph" style={{ fontSize: '20px' }}>
                    HERE'S A THERAPY TIP FOR YOU, START BY TAKING A MOMENT TO RELAX YOUR MIND</b>

                  <br></br>
                  <br></br>
                  <b className="paragraph-1" style={{ fontSize: '24px' }}>"{recommendedTherapy}"</b>
                  <br></br>
                  <br></br>
                  <img
                    src={stressReduce}
                    alt="3D Background"
                    style={{
                      width: '280px', // Adjust the width as needed
                      height: '115px', // Adjust the height as needed
                      objectFit: 'cover', // Set the object-fit property as needed
                    }}
                  />
                </div>
              </div>

              <div className="grid-container2">
                <div className="highlight-box2">
                  <p className="paragraph-22">By trying {recommendedTherapy} You can get these benefits, Let's go</p>
                  <p className="benefitssssss">{recommendedBenefits}</p>
                  {isSpeaking ? (
                    <button
                      style={{
                        backgroundColor: '#61C7CE',
                        color: 'black',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        width: '25%',
                        height: '9%',
                        border: ' 1px solid #000000',
                        fontFamily: 'initial',
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                      onClick={stopSpeaking}
                    >
                      Stop Reading
                    </button>
                  ) : (
                    <button
                      style={{
                        backgroundColor: '#61C7CE',
                        color: 'black',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        width: '25%',
                        height: '9%',
                        border: ' 1px solid #000000',
                        fontFamily: 'initial',
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                      onClick={() =>
                        startSpeaking(
                          "By trying " + recommendedTherapy + ", you can get these benefits, Let's go. " + recommendedBenefits
                        )
                      }
                    >
                      Read this for me
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div class="message-box">
              <p>YOU'VE ADDED A SPRINKLE OF MAGIC TO YOUR DAY. THANK YOU!</p>
              <br></br>
              <br></br>
              <p style={{ fontSize: '18px' }}>A holistic tool designed to empower you with insights into your mental well-being. In this intuitive interface,
                you can gain a comprehensive understanding of your mental health by tracking key factors such as stress levels over the week,
                your confidence, sleep efficiency, and access to therapy resources for reducing stress.
                We believe that a healthy mind is the cornerstone of a productive and content work life,
                and this platform aims to assist you in your journey towards emotional well-being. Take control of your mental health,
                make informed decisions, and find the support you need to thrive both personally and professionally</p>
            </div>
          )}
          <audio ref={audioRef} src={backgroundMusic} loop volume={1} />

        </div>
      </div>
    </Box>
  );
};

export default Modal;
