import React, { useState } from 'react'
import Camera from 'react-html5-camera-photo'
import 'react-html5-camera-photo/build/css/index.css'
import ImagePreview from '../../ImagePreview'
import { EmotionDetection } from "../../services/FaceEmotionService";
import axios from "axios";

function OfflineCameraApp() {
    const [dataUri, setDataUri] = useState('')
    const [state, setState] = useState(0)
     
    async function handleTakePhoto(dataUri) {
        try{
            // let data = await EmotionDetection(dataUri);
            // console.log("final emotion",data)
            
            // Create a FormData object to send the image as a file
            const formData = new FormData();
            formData.append('file', dataUri);

            // Set the headers including Content-Type
            const headers = {
                'Content-Type': 'application/json', // You mentioned application/json, but it should be multipart/form-data
            };

            // Send the image to the Flask backend
            const response = await axios.post(
                'http://127.0.0.1:5000/detect-emotion',
                formData,
                {
                headers: headers,
                }
            );
            console.log("response",response);
           
        } catch (error) {
            console.error("Error loading model:", error);
        }
    }
    const isFullscreen = false
    return (
        <div>
            {
                (dataUri)
                    ? <ImagePreview dataUri={dataUri}
                        isFullscreen={isFullscreen}
                    />
                    : <Camera
                        onTakePhoto={(dataUri) => { handleTakePhoto(dataUri); }}
                    />
            }
            <div><h3>The room is clean: {(state == 0 ? "" : state < 0.5 ? "True" : "False")}</h3></div>
            <div><h3>PredictedVal: {state} </h3></div>
        </div>
    );
}

export default OfflineCameraApp