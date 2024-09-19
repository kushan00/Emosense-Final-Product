import React, { useState, useEffect } from 'react';
import '../Styles/form.css';
import backgroundImage from '../images/background.jpg';
import axios from 'axios';
import Modal from './Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const FormComponent = () => {
  const [formData, setFormData] = useState({
    heartrate: null,
    Sleephours: null,
    awakenings: null,
    Alcoholconsumption: null,
    Smokingstatus: null,
    feedback: '',
  });

  const [stressResult, setStressResult] = useState(null);
  const [stressLevelResult, setStressLevelResult] = useState(null);
  const [recommendedTherapy, setRecommendedTherapy] = useState(null);
  const [recommendedBenefits, setRecommendedBenefits] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFriday, setIsFriday] = useState(false);
  const [currentDay, setCurrentDay] = useState('');
  const [stressData, setStressData] = useState([]);


  const fetchStressData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/suggested-therapy/last-five-days-stress-levels/${localStorage.getItem("userID")}`);
      return response.data; // Assuming your API returns the stress data for the past 5 days
    } catch (error) {
      throw error; // Handle the error appropriately in your application
    }
  };



  useEffect(() => {
    // Check the current day and set the isFriday state accordingly
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayIndex = new Date().getDay();


    //*******************date changing point*************************** */


    setCurrentDay('Friday'); // Simulate that today is Friday
    //setCurrentDay(daysOfWeek[currentDayIndex]);


    //********************************************** */

    if (currentDay === 'Friday') {
      setIsFriday(true); // It's Friday, open the modal with therapy recommendations
      setIsModalOpen(true); // Set the modal to open

      fetchStressData()
        .then((data) => {
          setStressData(data);
        })
        .catch((error) => {
          console.error('Error fetching stress data:', error);
        });

    } else {
      setIsFriday(false); // It's not Friday
      setIsModalOpen(false); // Set the modal to closed
    }
  }, []);

  const validateForm = () => {
    let isValid = true;
    if (
      isNaN(formData.heartrate) ||
      formData.heartrate < 60 ||
      formData.heartrate > 100
    ) {
      toast.error('Heart rate must be between 60 and 100.');
      isValid = false;
    }
    if (
      isNaN(formData.Sleephours) ||
      formData.Sleephours < 0 ||
      formData.Sleephours > 24
    ) {
      toast.error('There is only 24 hours for a day ,Sleep hours must be between 0 and 24.');
      isValid = false;
    }
    if (
      isNaN(formData.awakenings) ||
      formData.awakenings < 0 ||
      formData.awakenings > 10
    ) {
      toast.error('Normally person have awakenings maximum 10 during the sleep, must be between 0 and 10.');
      isValid = false;
    }
    if (!/^[a-zA-Z\s]*$/.test(formData.feedback)) {
      toast.error('Feedback should only contain letters and spaces.');
      isValid = false;
    }
    if (!formData.heartrate || !formData.Sleephours || !formData.awakenings) {
      toast.error('All inputs are required.');
      isValid = false;
    }
    return isValid;
  };

  console.log(currentDay);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
    // Send data to Flask API for stress prediction
    const stressResponse = await axios.post('http://127.0.0.1:5000/api/predict/stress', {
      feedback: formData.feedback,
    });

    setStressResult(stressResponse.data);

    const dataSet ={
        heartrate: formData?.heartrate,
        Sleephours: formData?.Sleephours,
        Awakenings:formData?.awakenings,
        Alcoholconsumption: formData?.Alcoholconsumption,
        Smokingstatus: formData?.Smokingstatus
    
    }

    // Send data to Flask API for stress level prediction
    const stressLevelResponse = await axios.post('http://127.0.0.1:5000/predict/stresslevel', dataSet);

    setStressLevelResult(stressLevelResponse.data);



    // Send data to your therapy API to get recommended therapy and benefits
    const therapyResponse = await axios.get(`http://localhost:5000/therapy/random/${stressLevelResponse.data.predicted_stress}`);


    setRecommendedTherapy(therapyResponse.data.therapy); // Adjust this based on your API response
    setRecommendedBenefits(therapyResponse.data.benefits); // Adjust this based on your API response


    // Insert user data into the chatbot database and provide stress_level
    insertData(
    stressLevelResponse.data.predicted_stress,
    stressResponse.data.confidence,
    stressLevelResponse.data.predicted_sleepefficiency,
    therapyResponse.data.therapy,
    therapyResponse.data.benefits
    );
    
    
    setFormData({
      heartrate: '',
      Sleephours: '',
      awakenings: '',
      Alcoholconsumption: '',
      Smokingstatus: '',
      feedback: '',
    });
    //,therapyResponse.data.therapy,therapyResponse.data.benefits
   

    // Open the modal
    setIsModalOpen(true);
  }
  };




  const insertData = async (stressLevel,sleepEfficiency,confidenceLevel,therapy,benefit) => {
    const finalData = {
      heartrate: formData.heartrate,
      Sleephours: formData.Sleephours,
      Awakenings: formData.awakenings,
      Alcoholconsumption: formData.Alcoholconsumption,
      Smokingstatus: formData.Smokingstatus,
      feedback: formData.feedback,
      user_id: localStorage.getItem("userID"),
      fullName: "kushan",
      email: "kushan@gmail.com",
      stress_level: stressLevel,
      sleep_efficiency: sleepEfficiency,
      confidence_level:confidenceLevel,
      therapy:therapy,
      benefit:benefit,
      situation_feedback: "remove from DB"
    };

    try {
      const response = await axios.post('http://localhost:5000/chatbotinput/chatbotinput-insert', finalData);

      console.log('Data inserted:', response.data);

      getWeekendData();
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };

  const getWeekendData = () => {



    fetch(`http://localhost:5000/chatbotinput/chatbotinput-get/${localStorage.getItem("userID")}`, {

      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log("Output Data:", data);
        localStorage.setItem("mostCommonStressLevel", data.mostCommonStressLevel);
      })
      .catch(error => console.error('Error fetching data:', error));
  };


  const closeModal = () => {
    setIsModalOpen(false);
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let inputValue;
  
    if (name === 'heartrate' || name === 'Sleephours' || name === 'awakenings') {
      // Limit the input to 3 digits for heartrate and 2 digits for Sleephours and awakenings
      inputValue = value.replace(/\D/g, '').slice(0, name === 'heartrate' ? 3 : 2);
    } else if (name === 'Alcoholconsumption') {
      // Ensure Alcoholconsumption is in the range of 0-5
      inputValue = value ? Math.min(5, Math.max(0, parseFloat(value))) : null;
    } else if (name === 'Smokingstatus') {
      // Handle Smokingstatus as a selection (Yes or No)
      inputValue = value === 'Yes' ? 'Yes' : 'No';
    } else {
      // Default to the value itself or null if empty
      inputValue = type === 'checkbox' ? checked : value || null;
    }
  
    setFormData({
      ...formData,
      [name]: inputValue,
    });
  };
  



  return (
    <div className="form-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="form-content">
      <ToastContainer />
        <h1 className="form-title">Remote Work Mate</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{color:'black'}}>Enter Your Last Night Heart Rate (bpm)</label>
            <br />
            <input
              type="number"
              name="heartrate"
              value={formData.heartrate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label style={{color:'black'}}>Enter Your Last Night Sleep Duration (hours)</label>
            <br />
            <input
              type="number"
              name="Sleephours"
              value={formData.Sleephours}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label style={{color:'black'}}>Enter Your Awakenings At Last Night</label>
            <br />
            <input
              type="number"
              name="awakenings"
              value={formData.awakenings}
              onChange={handleChange}
            />
          </div>
          <div className="form-group select-container">
            <label style={{color:'black'}}>Enter Your Alcohol Consumption At Last Night ( Rate 0-5 )</label>
            <br />
            <select
              className="custom-select"
              name="Alcoholconsumption"
              value={formData.Alcoholconsumption}
              onChange={handleChange}
            >

              <option value={null}>Select</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>

            </select>

          </div>
          <div className="form-group select-container">
            <label style={{color:'black'}}>Have you smoked At Last Night</label>
            <br />
            <select
              className="custom-select"
              name="Smokingstatus"
              value={formData.Smokingstatus}
              onChange={handleChange}
            >
              <option value={null}>Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>



          <div className="form-group">
            <label style={{color:'black'}}>Enter Today Your Work Environment Feedback</label>
            <br />
            <textarea
              rows="2"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
            />
          </div>
          <button className="submit-button" type="submit" style={{width:'200px',marginLeft:'130px',fontFamily:'initial'}}>
            Submit
          </button>
        </form>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          stressResult={stressResult}
          stressLevelResult={stressLevelResult}
          recommendedTherapy={recommendedTherapy}
          recommendedBenefits={recommendedBenefits}
          isFriday={currentDay === 'Friday'}
          stressData={stressData}
        />


      </div>
      {/* Add more butterflies with different positions */}
    </div>
  );
};

export default FormComponent;
