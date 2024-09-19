import React, { Component } from 'react';
import './FeedbackForm.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const containerStyle = {
  backgroundColor: 'blue',
  border: '1px solid #ccc',
  padding: '20px',
  borderRadius: '5px',
};

class FeedbackForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem("userID"),
      fullName: localStorage.getItem("user"),
      email: localStorage.getItem("_id"),
      date: '',
      suggested_therapy: '',
      feedback_of_therapy: '',
      rate: '',
      recommendedBenefit:"",
      recommendedTherapy:"",
      showSuggestedTherapy:false
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  componentDidMount() {
    this.getlatesttherapy();
  }

 getlatesttherapy = async ()=> {
  const response = await axios.get(`http://localhost:5000/suggested-therapy/suggested-therapies-by-user/${localStorage.getItem("userID")}`);
  console.log("responssssssssssssssssssssssssssssss",response);
  if (response.data.status === 1) 
  {
    this.setState({
      suggested_therapy: response.data.data.latestSuggestedTherapy.therapy,
    });
  } else {
    console.error('Failed to submit feedback.');
  }
 }

 handleSubmit = async (e) => {
  e.preventDefault();

  // Prepare the data to send to the server
  const formData = { ...this.state };
  console.log("-------------formData---------------",formData);

  // Send a POST request to your backend API
  try {
    const response = await fetch('http://localhost:5000/feedback/feedback-inputs-insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      console.log('Feedback submitted successfully.');
      // Reset the form fields if needed
      this.setState({
        date: '',
        suggested_therapy: '',
        feedback_of_therapy: '',
        rate: '',

      });

      const rate = parseInt(formData.rate)

      if(rate > 3)
      {
        toast.success("Please continue with you current therapy...!", {
          theme: "colored"
        });
      }
      else
      {
        this.fetchRandomTherapy(window.localStorage.getItem("mostCommonStressLevel"));
      }
    
    } else {
      console.error('Failed to submit feedback.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

insertSuggestedTheray = (stress_level,therapy) => {
  const { answers } = this.state;
  console.log("-----------------------answers,stress_level,situation_feedback----------------------------------",answers);
  const finaldata = {
    "therapy":therapy,
    "user_id":localStorage.getItem("userID"),
    "fullName":localStorage.getItem("user"),
    "email":localStorage.getItem("_id"),
    "stress_level": stress_level,
    "position": "remove from DB"
  };

  console.log("----------------insertSuggestedTheray---------------------",finaldata);


  fetch('http://localhost:5000/suggested-therapy/new-suggested-therapy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(finaldata),
  })
    .then(response => response.json())
    .then(data => {
        console.log("Insert suggested therapy ",data);
        if(data.email != null || data.email !== undefined)
        {
          toast.success("Your New Therapy Stored in DB", {
            theme: "colored"
          });
        }
        else
        {
          toast.success("Therapy Error", {
            theme: "colored"
          });
        }


    })
    .catch(error => console.error('Error sending data:', error));

};

fetchRandomTherapy = async (predicted_stress) => {
  console.log(predicted_stress);
  try {
    const response = await fetch(`http://localhost:5000/therapy/random/${predicted_stress}`); // Use the correct URL
    console.log('Response:', response);
    const data = await response.json();
    console.log('Parsed Data:', data);

    // Fetch the therapy and benefits based on the therapy category
    const recommendedTherapy = data.therapy;
    const recommendedBenefits = data.benefits;

    this.setState({
      recommendedBenefit:recommendedBenefits,
      recommendedTherapy:recommendedTherapy,
      showSuggestedTherapy:true
    });

    this.insertSuggestedTheray(predicted_stress,recommendedTherapy)

  } catch (error) {
    console.error('Error fetching random therapy:', error);
  }
};


  render() {
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
        {this.state.showSuggestedTherapy == false ? 
        <div className="feedback-form-container">
          <h2 style={{color:'white'}}>Feedback Form</h2>
          <h5 style={{color:'white'}}>Please provide the previous therapy feedback...</h5>
          <form onSubmit={this.handleSubmit}>

          {/* <div className="form-group">
              <label style={{color:'white'}} >User ID:</label>
              <input
                type="text"
                name="user_id"
                value={this.state.user_id}
                onChange={this.handleChange}
              />
            </div>
            
            <div className="form-group">
              <label style={{color:'white'}}>Full Name :</label>
              <input
                type="text"
                name="fullName"
                value={this.state.fullName}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label style={{color:'white'}}>Email :</label>
              <input
                type="email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
              />
            </div> */}
            <div className="form-group">
              <label style={{color:'white'}}>Date :</label>
              <input
                type="date"
                name="date"
                value={this.state.date}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label style={{color:'white'}}>Suggested Therapy :</label>
              <input
                type="text"
                name="suggested_therapy"
                value={this.state.suggested_therapy}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label style={{color:'white'}}>Feedback of Therapy :</label>
              <textarea
                name="feedback_of_therapy"
                value={this.state.feedback_of_therapy}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label style={{color:'white'}}>Rate :</label>
              <select
                name="rate"
                value={this.state.rate}
                onChange={this.handleChange}
              >
                <option value="1">1 (Poor)</option>
                <option value="2">2 (Fair)</option>
                <option value="3">3 (Good)</option>
                <option value="4">4 (Very Good)</option>
                <option value="5">5 (Excellent)</option>
              </select></div>

            <button type="submit">Submit</button>
          </form>
        </div>
        : 
        <div style={containerStyle}>
          <h2>Recommended Therapy:</h2>
          <p>{this.state.recommendedTherapy}</p>
          <h2>Recommended Benefit:</h2>
          <p>{this.state.recommendedBenefit}</p>
        </div>
        }
      </div>
    );
  }
}

export default FeedbackForm;