import React, { Component } from 'react';
import './ChatBot.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS
import { toast ,ToastContainer  } from 'react-toastify';
import { Link } from 'react-router-dom';

const buttonStyle = {
  display: 'inline-block',
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  border: 'none',
  cursor: 'pointer',
};

class ChatBot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      userInput: '',
      currentQuestionIndex: -1,
      answers: [],
      questions: [
        "How was your heart rate at last night?",
        "How many hours did you sleep at last night?",
        "How many times did you wake up at last night?",
        "Rate your alcohol consumption at last night (0-5):",
        "Did you smoke at last night?",
        "How is your work environment today?",
      ],
      isSurveyComplete: false,
      suggestions: [], // New state variable for suggestions
      situation_feedback:" ",
      stress_level:" ",
      currentDay: '',
    };
  }

  componentDidMount() {
    const initialBotMessage = {
      text: "Hello! I'm your remote workmate. Let's get started.",
      isUser: false,
    };

    const firstQuestionMessage = {
      text: this.state.questions[0],
      isUser: false,
    };

    this.setState({
      messages: [initialBotMessage, firstQuestionMessage],
      currentQuestionIndex: 0,
    });

    // Get the current date
    const currentDate = new Date();

    // Create an array of days of the week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Get the current day of the week
    const currentDay = daysOfWeek[currentDate.getDay()];

    localStorage.setItem("currentDay",currentDay);
    // Update the component's state with the current day
    this.setState({ currentDay });

  }


  handleNextQuestion = () => {
    const { currentQuestionIndex, questions } = this.state;

    if (currentQuestionIndex >= questions.length - 1) {
      // Survey is complete
      this.setState({ isSurveyComplete: true });
      // Handle sending data to Flask endpoints
      const currentDay = localStorage.getItem("currentDay");
      console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",localStorage.getItem("currentDay"));
      if(currentDay === "Monday")
      {
        this.handlePredictStress();
        this.handlePredictStressAndSleepEfficiency();
      }
      
    } else {
      const nextQuestionIndex = currentQuestionIndex + 1;
      const nextQuestion = questions[nextQuestionIndex];
      let suggestions = [];

      if (nextQuestion.toLowerCase().includes("alcohol consumption")) {
        suggestions = ["0", "1", "2", "3", "4", "5"];
      } else if (nextQuestion.toLowerCase().includes("smoke")) {
        suggestions = ["Yes", "No"];
      }

      const nextQuestionMessage = {
        text: nextQuestion,
        isUser: false,
      };

      this.setState((prevState) => ({
        currentQuestionIndex: nextQuestionIndex,
        messages: [...prevState.messages, nextQuestionMessage],
        suggestions: suggestions,
      }));
    }
  };

  handleUserInput = (event) => {
    const userInput = event.target.value;
    this.setState({ userInput });
  };

  handleSuggestionClick = (suggestion) => {
    this.setState({ userInput: suggestion }, () => {
      this.handleSendMessage();
    });
  };

  handleSendMessage = () => {
    const {
      userInput,
      messages,
      currentQuestionIndex,
      questions,
      answers,
    } = this.state;

    if (userInput.trim() === '') return;

    const userMessage = {
      text: userInput,
      isUser: true,
    };

    this.setState((prevState) => ({
      messages: [...prevState.messages, userMessage],
      userInput: '',
    }));

    // Perform validation and handle answers
    let newBotMessage;
    let validInput = true;

    if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
      if (currentQuestionIndex === 0) {
        const numericValue = parseInt(userInput);
        if (isNaN(numericValue) || numericValue < 40 || numericValue > 70) {
          validInput = false;
          newBotMessage = {
            text: 'Please enter a valid heart rate between 40 and 70.',
            isUser: false,
          };
        } else {
          answers.push(numericValue);
        }
      } else if (currentQuestionIndex === 1) {
        const numericValue = parseFloat(userInput); // Use parseFloat for decimal values
        if (isNaN(numericValue) || numericValue < 0 || numericValue > 12) {
          validInput = false;
          newBotMessage = {
            text: 'Please enter a valid sleep hours between 0 and 12.',
            isUser: false,
          };
        } else {
          answers.push(`Sleep hours: ${numericValue}`);
          if (numericValue < 5) {
            const sleepMessage = {
              text: 'Pay attention to your sleeping!',
              isUser: false,
              style:{
                color: 'red'
              }
            };
            this.setState((prevState) => ({
              messages: [...prevState.messages, sleepMessage],
            }));
          }
        }
        //answers.push(numericValue);
      } else if (currentQuestionIndex === 2) {
        const numericValue = parseInt(userInput);
        if (isNaN(numericValue) || numericValue < 0 || numericValue > 10) {
          validInput = false;
          newBotMessage = {
            text: 'Please enter a valid number of awakenings between 0 and 10.',
            isUser: false,
          };
        } else {
          answers.push(`Awakenings: ${numericValue}`);
          if (numericValue > 3) {
            const awakeningsMessage = {
              text: 'Pay attention to your awakenings!',
              isUser: false,
              style:{
                color: 'red'
              }
            };
            this.setState((prevState) => ({
              messages: [...prevState.messages, awakeningsMessage],
            }));
          }
        }
        //answers.push(numericValue);
        
      } else if (currentQuestionIndex === 3) {
        const alcoholRate = parseInt(userInput);
        if (isNaN(alcoholRate) || alcoholRate < 0 || alcoholRate > 5) {
          validInput = false;
          newBotMessage = {
            text: 'Please enter a valid alcohol consumption rate between 0 and 5.',
            isUser: false,
          };
        } else {
          answers.push(`Alcohol consumption rate: ${alcoholRate}`);
        }
      } else if (currentQuestionIndex === 4) {
        const smokingAnswer = userInput.toLowerCase();
        if (smokingAnswer !== 'yes' && smokingAnswer !== 'no') {
          validInput = false;
          newBotMessage = {
            text: 'Please answer with "Yes" or "No".',
            isUser: false,
          };
        } else {
          answers.push(`Smoking: ${smokingAnswer}`);
        }
      } else if (currentQuestionIndex === 5) {
        const feedback = userInput;
        if (!feedback || !isNaN(feedback)) {
          validInput = false;
          newBotMessage = {
            text: 'Please provide valid feedback.',
            isUser: false,
          };
        } else {
          answers.push(`Work environment feedback: ${feedback}`);
        }
      }

      // If validation failed, display the validation message
      if (!validInput) {
        this.setState((prevState) => ({
          messages: [...prevState.messages, newBotMessage],
        }));
        return; // Exit early without continuing to the next question
      }
    }

    // Continue to the next question
    this.handleNextQuestion();
    // Start an interval to repeatedly check the boolean value
    //this.intervalId = setInterval(this.checkBooleanAndExecute, 1000); // Adjust the interval as needed
  };


  // componentWillUnmount() {
  //   // Clear the interval when the component is unmounted
  //   clearInterval(this.intervalId);
  // }

  // checkBooleanAndExecute = () => {
  //   const { isSurveyComplete } = this.state;

  //   if (isSurveyComplete) {
  //       // Handle sending data to Flask endpoints
  //       this.handlePredictStress();
  //       this.handlePredictStressAndSleepEfficiency();
  //       clearInterval(this.intervalId);
  //   }
  // };

  handlePredictStress = () => {
    const { userInput } = this.state;
    const { answers ,situation_feedback} = this.state;  // Retrieve answers from the state

    const parts = answers[5].split(":");
    const keyword = parts[1].trim();
    console.log("---------------------", keyword);
    fetch('http://127.0.0.1:5000/api/predict/stress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feedback: keyword }),
    })
      .then(response => response.json())
      .then(data => {
        this.setState({situation_feedback: data.predicted_stress_level},()=>{
          console.warn("State updated:", this.state.situation_feedback);
        });
        localStorage.setItem("predicted_stress_level",data.predicted_stress_level);
        // const botMessage = {
        //   text: `Predicted Your Situation By feedback: ${data.predicted_stress_level}`,
        //   isUser: false,
        // };
        localStorage.setItem("confidence",data.confidence);
        // const confidence = {
        //   text: `Predicted Your Confidence: ${data.confidence}`,
        //   isUser: false,
        // };
        localStorage.setItem("predicted_sentence_range",data.predicted_sentence_range);
        // const predicted_sentence_range = {
        //   text: `Feedback Sentence Range: ${data.predicted_sentence_range}`,
        //   isUser: false,
        // };

        // this.setState(prevState => ({
        //   messages: [...prevState.messages, botMessage, confidence, predicted_sentence_range],
        // }));

      })
      .catch(error => console.error('Error sending data:', error));
  };

  getweekendData = ()=>{
      fetch('http://localhost:5000/chatbotinput/chatbotinput-get/adasdas', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(finaldata),
    })
      .then(response => response.json())
      .then(data => {
          console.warn(" ----------------Output Data ",data);
          window.localStorage.setItem("mostCommonStressLevel",data.mostCommonStressLevel);
          this.fetchRandomTherapy(data.mostCommonStressLevel);
      })
      .catch(error => console.error('Error sending data:', error));
  }

  insertChatBotData = (stress_level) => {
    const { answers } = this.state;
    console.log("-----------------------answers,stress_level,situation_feedback----------------------------------",answers);
    const finaldata = {
      "heartrate":answers[0],
      "Sleephours":answers[1].split(":")[1],
      "Awakenings":answers[2].split(":")[1],
      "Alcoholconsumption":answers[3].split(":")[1],
      "Smokingstatus":answers[4].split(":")[1],
      "feedback":answers[5].split(":")[1],
      "user_id":"adasdas",
      "fullName":"asdasd",
      "email":"asdasd",
      "stress_level": stress_level,
      "situation_feedback": "remove from DB"
    };

    console.log("-------------------------------------",finaldata);

  

    fetch('http://localhost:5000/chatbotinput/chatbotinput-insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finaldata),
    })
      .then(response => response.json())
      .then(data => {
          console.log(data);
          this.getweekendData();
      })
      .catch(error => console.error('Error sending data:', error));

  };

  insertSuggestedTheray = (stress_level,therapy) => {
    const { answers } = this.state;
    console.log("-----------------------answers,stress_level,situation_feedback----------------------------------",answers);
    const finaldata = {
      "therapy":therapy,
      "user_id":"adasdas",
      "fullName":"asdasd",
      "email":"asdasd",
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
          if(data.email != null || data.email != undefined)
          {
            const buttonMessage = {
              // text: (
              //   <div>
              //     <Link to="/feedback"><button>form</button></Link>
              //   </div>
              // ),
              text:"/feedback",
              isUser: false,
            };

            this.setState(prevState => ({
              messages: [...prevState.messages, buttonMessage],
            }));
          }
          else
          {
            alert("Therapy didnot stored")
          }


      })
      .catch(error => console.error('Error sending data:', error));

  };



  handlePredictStressAndSleepEfficiency = () => {
    const { answers } = this.state;  // Retrieve answers from the state

    const alcoholAnswer = answers[3];  // "Alcohol consumption rate: 2"
    const alcoholRate = parseInt(alcoholAnswer.split(":")[1].trim());

    const userFeatures = {
      heartrate: answers[0],
      Sleephours: answers[1],
      Awakenings: answers[2],
      Alcoholconsumption: alcoholRate,  // Use the extracted numeric value
      Smokingstatus: answers[4],
    };


    fetch('http://127.0.0.1:5000/predict/stresslevel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userFeatures),
    })
      .then(response => response.json())
      .then(data => {
        // this.setState({stress_level: data.predicted_stress},()=>{
        //   console.warn("State updated:", this.state.stress_level);
        // });
        this.insertChatBotData(data.predicted_stress);
        localStorage.setItem("predicted_stress",data.predicted_stress);
        // const botMessage = {
        //   text: `Your Predicted stress level: ${data.predicted_stress}`,
        //   isUser: false,
        // };
        localStorage.setItem("predicted_sleepefficiency",data.predicted_sleepefficiency);
        // const sleepMessage = {
        //   text: `Your Predicted Sleep Efficiency: ${data.predicted_sleepefficiency}`,
        //   isUser: false,
        // };

        // this.setState(prevState => ({
        //   messages: [...prevState.messages, botMessage, sleepMessage],
        // }));
        // Fetch a random therapy recommendation based on the predicted stress level
        // this.fetchRandomTherapy(data.predicted_stress);
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

      localStorage.setItem("recommendedTherapy",recommendedTherapy);
      // // Create bot messages for therapy and benefits
      // const therapyMessage = {
      //   text: `Recommended Therapy: ${recommendedTherapy}`,
      //   isUser: false,
      // };
      localStorage.setItem("recommendedBenefits",recommendedBenefits);
      // const benefitsMessage = {
      //   text: `Benefits: ${recommendedBenefits}`,
      //   isUser: false,
      // };

      this.insertSuggestedTheray(predicted_stress,recommendedTherapy)

      // Add the bot messages to the chat messages state
      // this.setState(prevState => ({
      //   messages: [...prevState.messages, therapyMessage, benefitsMessage],
      // }));
    } catch (error) {
      console.error('Error fetching random therapy:', error);
    }
  };

  closeChatBot = async () => {
    console.warn("class close executed");
    window.localStorage.setItem("chatbotStatus",false);
  }

  render() {
    const { messages, userInput, isSurveyComplete, suggestions } = this.state;

    return (
      <div className="chatbot-container">
          <ToastContainer />
        <div className="chatbot-header">
          <span className="chatbot-title">
            <b>Remote Workmate</b>       
          </span>
        </div>
        <div className="chatbot-messages">
          <span className="message-icon">
            <FontAwesomeIcon icon={faRobot} />
          </span>
          {messages.map((message, index) => (
            <div
              key={index}
              className={message.isUser ? 'user-message' : 'bot-message'}
            >
              {message.text === "/feedback" ? <Link to="/feedback" style={buttonStyle} >Got to Form</Link> : message.text  }

            </div>
          ))}
          {suggestions.length > 0 && (
            <div className="suggestion-container">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => this.handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="input-container">
          {!isSurveyComplete && (
            <>
              <input
                type="text"
                value={userInput}
                onChange={this.handleUserInput}
                placeholder="Type your message..."
              />
              <button style={{ backgroundColor: '#076161', color: 'white', width: '80px', fontFamily: 'cursive' }} onClick={this.handleSendMessage}>Send</button>
            </>
          )}
          {isSurveyComplete && (
            <div className="survey-complete-message">
              Survey complete. Thank you!
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ChatBot;
