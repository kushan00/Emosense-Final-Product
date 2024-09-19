import React, { useState, useEffect, useRef } from 'react';
import '../Styles/mentalHealthSummary.css';
import backgroundMusic from '../images/song.mp3';

const MentalHealthSummary = () => {
  const [lastFiveDaysData, setLastFiveDaysData] = useState([]);
  const [lastDayData, setLastDayData] = useState({});
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

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return `${formattedDate} ${formattedTime}`;
  }

  

  useEffect(() => {
    // Fetch data from the last five days endpoint
    fetch(`http://localhost:5000/chatbotinput/last-five-days-inputs/${localStorage.getItem("userID")}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched last five days data:', data?.data?.chatbot_inputs);
        setLastFiveDaysData(data?.data?.chatbot_inputs);
      })
      .catch((error) => {
        console.error('Error fetching last five days data:', error);
      });

    // Fetch data from the last day endpoint
    fetch(`http://localhost:5000/chatbotinput/lastday-input/${localStorage.getItem("userID")}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched last day data:', data?.data?.chatbot_input);

        // Assuming the properties are directly under chatbot_input
        setLastDayData(data?.data?.chatbot_input);
      })
      .catch((error) => {
        console.error('Error fetching last day data:', error);
      });
  }, []);

  return (
    <div className="mental-health-summary">
      <p className="paragraph-3">
        Welcome to the Employee Mental Health Summary,
        a holistic tool designed to empower you with insights into your mental well-being. In this intuitive interface,
        you can gain a comprehensive understanding of your mental health by tracking key factors such as stress levels over the week,
        your confidence, sleep efficiency, and access to therapy resources for reducing stress.
        We believe that a healthy mind is the cornerstone of a productive and content work life,
        and this platform aims to assist you in your journey towards emotional well-being. Take control of your mental health,
        make informed decisions, and find the support you need to thrive both personally and professionally
      </p>
      <center>
        <table className="summary-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Stress Level</th>
              <th>Sleep Efficiency</th>
              <th>Sleep Category</th>
              <th>Confidence Level</th>
              <th>Confidence Category</th>
            </tr>
          </thead>
          <tbody>
            {lastFiveDaysData.map((data) => (
              <tr key={data._id}>
                <td>{formatDate(data.createdAt)}</td>
                <td>{data.stress_level}</td>
                <td>{(data.sleep_efficiency * 100).toFixed(2)}%</td>
                <td>{(data.sleep_efficiency * 100).toFixed(2) >= 90 ? 
                      "Excellent" 
                    :(data.sleep_efficiency * 100).toFixed(2) >= 80 ?
                      "Good"
                    :(data.sleep_efficiency * 100).toFixed(2) >= 70 ?
                      "Fair"
                    :(data.sleep_efficiency * 100).toFixed(2) >= 60 ?
                      "Poor"
                    : "Very Poor"
                    }</td>
                <td>{(data.confidence_level * 100).toFixed(2)}%</td>
                <td>{(data.confidence_level * 100).toFixed(2) >= 81 ? 
                      "High Confidence" 
                    :(data.confidence_level * 100).toFixed(2) >= 61 ?
                      "Reasonable Confidence"
                    :(data.confidence_level * 100).toFixed(2) >= 41 ?
                      "Moderate Confidence"
                    :(data.confidence_level * 100).toFixed(2) >= 21 ?
                      "Low Confidence"
                    : "Very Low Confidence"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      
        <div className="therapy-benefit">
          <br></br>
          <div className="therapy-benefit-grid">
            <div className="therapy-box">
              <p className="paragraph-22">
                HERE'S A THERAPY TIP FOR YOU, START BY TAKING A MOMENT TO RELAX YOUR MIND
              </p>
              <p className="paragraph-2">{lastDayData.therapy}</p>
              <p className="paragraph-22">LET'S GO WITH THIS.</p>
              <p className="paragraph-2">{lastDayData.benefit}</p>
              {isSpeaking ? (
                <button
                  style={{
                    backgroundColor: '#61C7CE',
                    color: 'black',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width:'18%',
                    height:'9%',
                    border:'1px solid #000000',
                    fontFamily:'initial',
                    textAlign:'center',
                    fontSize:'14px',
                    fontWeight:'bold',
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
                    width:'18%',
                    height:'9%',
                    border:'1px solid #000000',
                    fontFamily:'initial',
                    textAlign:'center',
                    fontSize:'14px',
                    fontWeight:'bold',
                    marginLeft:'420px',
                  }}
                  onClick={() =>
                    startSpeaking(`Let's go with this... ${lastDayData.benefit}`)
                  }
                >
                  Read this for me
                </button>
              )}
              <audio ref={audioRef} src={backgroundMusic} loop volume={1} />
            </div>
          </div>
        </div>
      </center>
    </div>
  );
};

export default MentalHealthSummary;
