import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";
import "./styles.css";
import Iframe from 'react-iframe'
import { Label, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { getUserHeartRate } from "../../services/UserServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2"

function AutoCamera() {
  const navigate = useNavigate();

  const webcamRef = useRef(null);
  // const [capturedImage, setCapturedImage] = useState(null);
  const [emotion, setEmotion] = useState("");
  const [heartRateEmotion, setheartRateEmotion] = useState("");
  const [openModal, setopenModal] = useState(true);
  const [loader, setloader] = useState(false);
  const [song, setSong] = useState("");

  const captureImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // setCapturedImage(imageSrc);
    // Convert imageSrc to Blob or File
    const imageBlob = await fetch(imageSrc).then((res) => res.blob());
    sendImageToAPI(imageBlob);
  };

  async function sendImageToAPI(imageBlob) {
    const formData = new FormData();
    formData.append("file", imageBlob, "webcam_image.jpg");
    //getSong("happy");
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/detect-emotion",
        formData
      );

      // Handle response as needed
      console.log("response", response.data.emotion);
      setEmotion(response.data.emotion);
      localStorage.setItem("face_emotion",response.data.emotion);
      getLatestHeartRateEmotion();
    } catch (error) {
      // Handle error
    }
  }

  const getLatestHeartRateEmotion = async ()=>{

    try{
      const user_id = localStorage.getItem("userID");

      const response = await getUserHeartRate("user001");

      console.log("heart_rate", response?.data?.data?.heartRateData?.heart_rate);

      const data = {
         "heart_rate":response?.data?.data?.heartRateData?.heart_rate
      }

      const res = await axios.post(
        "http://127.0.0.1:5000/random-forest-heart-rate-predict-emotion",
        data
      );
      console.log("res",res?.data?.predicted_emotion);
      setheartRateEmotion(res?.data?.predicted_emotion);
      localStorage.setItem("heart_rate_emotion",res?.data?.predicted_emotion);
      getFinalEmotionFromComparisan();

    }
    catch(err){

    }

  }

  const getFinalEmotionFromComparisan = async ()=>{
    
    const emotion1 = localStorage.getItem("face_emotion");
    const emotion2 = localStorage.getItem("heart_rate_emotion");

    const data = {
        "emotion1":emotion1
        ,"emotion2" : emotion2
    };

   const res = await axios.post(
     "http://127.0.0.1:5000/compare_emotions",
     data
   );

   console.log('final emotion',res )
   if(res.data.most_accurate_emotion == "Both emotions are equally accurate")
   {
    const fc_em = localStorage.getItem("face_emotion");
    getSong(fc_em);
   }
   else
   {
    getSong(res.data.most_accurate_emotion);
   }

  }

  async function getHeartRateOfUser() {    
    try {
      const user_id = localStorage.getItem("userID");

      const response = await getUserHeartRate(user_id);

      // Handle response as needed
      console.log("response", response);
      const diff =  checkTimeDiff(response?.data?.data?.heartRateData?.updatedAt);
      console.log(diff);
      if(diff.name == "timeDifferenceInSeconds" || diff.name == "minutesAgo")
      {
        if(diff.value <= 40 && diff.name != "minutesAgo")
        {
          setopenModal(false);
          setloader(true);
          setTimeout(() => {
            captureImage();
          }, 3000);
        }
        else
        {
          if(diff.name == "minutesAgo")
          {
            if(diff.value <= 5)
            {
              setopenModal(false);
              setloader(true);
              setTimeout(() => {
                captureImage();
              }, 3000);
            }
            else
            {
              setopenModal(true);
              toast.error("Heart rate not updated recently...! \n Update again via app", {
                theme: "colored"
              });
            }        
          }
          else
          {
            setopenModal(true);
            toast.error("Heart rate not updated recently...! \n Update again via app", {
              theme: "colored"
            });
          }
        }
      }
      else
      {
        setopenModal(true);
        toast.error("Heart rate not updated recently...! \n Update again via app", {
          theme: "colored"
        });
      }
    } catch (error) {
      // Handle error
    }
  }

  const [songDetails, setsongDetails] = useState({});

  async function getSong(emotion) {
    console.log(emotion);
    const formData = new FormData();
    const u_id = localStorage.getItem("_id");

    const user = await axios.get(`http://localhost:5000/emosense/user/get-user/${u_id}`);
    console.log("user token",user?.data?.data?.data?.accessToken);
    // const accessToken = "EAALLb94vWMQBO68VDToa84BfJReX1BB6L0tAIsXBGGRLDwxMmHs4ODj6nPhtHjWbRvhzWd2ZCZA88KGi2NCt6lgMFCyTICE82BeJ5bZASRZBLwl0BwJNiz9ooRf9d97VQ4KQRuexiAWVPWJNma43FhjNM6i5rVthSLZC84wtiEtfXnUvtVOrWTKLEzLduVhL2JkJuw35EshtFdcMU22QJ0kZBqZAMeZA5r6XlgZDZD";
    const accessToken = user?.data?.data?.data?.accessToken;

    formData.append("access_token", accessToken);
    formData.append("emotion", emotion);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/get-music",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(response?.data);
      setsongDetails(response?.data);
      // Handle response as needed
      setloader(false);

      setSong(response.data.videoId);
      
    } catch (error) {
      // Handle error
    }
  }

  const checkHeartRateUpdated = () => {
    //getHeartRateOfUser();
    setopenModal(false);
    setloader(true);
    setTimeout(() => {
      captureImage();
    }, 3000);
  };

  const closeSuggestPage = () => {
    navigate("/");
  };


  const checkTimeDiff = (updatedAt)=>{
    const updatedAtDate = new Date(updatedAt);
    const currentDate = new Date();

    const timeDifferenceInSeconds = Math.floor((currentDate - updatedAtDate) / 1000);
    
    var timeAgo = {};

    if (timeDifferenceInSeconds < 60) {
      // Less than a minute ago
      timeAgo = {name:"timeDifferenceInSeconds",value:timeDifferenceInSeconds};
    } else if (timeDifferenceInSeconds < 3600) {
      // Less than an hour ago
      const minutesAgo = Math.floor(timeDifferenceInSeconds / 60);
      timeAgo = {name:"minutesAgo",value:minutesAgo};
    } else if (timeDifferenceInSeconds < 86400) {
      // Less than a day ago
      const hoursAgo = Math.floor(timeDifferenceInSeconds / 3600);
      timeAgo = {name:"hoursAgo",value:hoursAgo};
    } else {
      // More than a day ago
      const daysAgo = Math.floor(timeDifferenceInSeconds / 86400);
      timeAgo = {name:"daysAgo",value:daysAgo};
    }

    return timeAgo;

  }


  const addtoMymusic = async ()=>{
    try {
      Swal.fire({
        title: 'Are you sure?',
        text: "You want to add this to your music!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Add to My Music'
      }).then(async(result) => {
        if (result.isConfirmed) {
          const res_data = {
            user_id : localStorage.getItem("userID"),
            song_name: songDetails?.songName,
            music_url: songDetails?.song,
            song_id: songDetails?.videoId
        };
          const data = await axios.post("http://localhost:5000/music/save-music",res_data)
          console.log(data);
          if(data?.data?.status === 1)
          {
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: "Added to My Music Successfully",
            });
            navigate("my-music")
          }
          else
          {
            Swal.fire({
              icon: "error",
              title: "Already Added",
              text: "Already Added to the List",
            });
          }
        }
      })
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Already Added",
        text: "Already Added to the List",
      });
    }
  }

  return (
    <div>
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {
        openModal === true 
        ?
        <div>
            <br/><br/>
            <center>
              <Label style={{ color: "white" , fontSize:"20px" }}>
                Update Heart Rate with Mobile App Before proceed...!
              </Label>
            </center>
            <br/>
            <center>
              <Button color="success" onClick={checkHeartRateUpdated}>
                Heart Rate Updated
              </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button color="warning" onClick={closeSuggestPage}>
                Close
              </Button>
          </center>
        </div>
        :
          <div>
          {loader === true ? (
            <div>
              <div className="row justify-content-center m-5">
                <Webcam ref={webcamRef} style={{ width: "50%", height: "50%" }} />
              </div>
                <div className="row justify-content-center m-lg-5">
                  <Label>Please wait...</Label>
                  <br />
                  <section className="dots-container">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </section>
                </div>
            </div>
          ) : (
            <div>
              {song === "" ?
              <></>
            :
            <div>
              <div className="row justify-content-center" style={{marginTop: '130px'}}>
                <Iframe 
                  src={`https://www.youtube.com/embed/${song}`}
                  width="640px"
                  height="320px"
                  id=""
                  className=""
                  display="block"
                  position="relative"/>              
              </div>
              <br/><br/>
              <center>
              <button className="btn btn-warning" onClick={()=>{addtoMymusic()}}>Add to My music</button>
              </center>
            </div>
            }
            </div>
          )}
        </div>
      }
    </div>
  );
}

export default AutoCamera;
