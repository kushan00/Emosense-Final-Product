import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from "axios";


function Camera() {

    const webcamRef = useRef(null);
    const [emotion, setEmotion] = useState("");
     
   

    async function sendImageToAPI(imageBlob) {
        const formData = new FormData();
        formData.append('file', imageBlob, 'webcam_image.jpg');

      
        try {
          const response = await axios.post(
            'http://127.0.0.1:5000/detect-emotion', 
            formData,
            );
          
          // Handle response as needed
          console.log("response",response);
          setEmotion(response.data.emotion);
        } catch (error) {
          // Handle error
        }
      }

      async function captureAndSendImage() {
        const imageSrc = webcamRef.current.getScreenshot();
        const imageBlob = await fetch(imageSrc).then((res) => res.blob());
        sendImageToAPI(imageBlob);
      }

    return (
        <div>
        <Webcam audio={false} ref={webcamRef} />
        <button onClick={captureAndSendImage}>Capture & Send</button>
        <div>
            Detected Emotion is : {emotion}
        </div>
      </div>
    );
}

export default Camera