const ChatbotInput = require('../models/ChatbotInputModel');
const _ = require('lodash');
const apiResponse = require("../helpers/apiResponse");

// Create a new chatbot input record
exports.createChatbotInput = async (req, res) => {
  try {
    const { heartrate, Sleephours, Awakenings, Alcoholconsumption, Smokingstatus, feedback ,user_id, fullName, email ,situation_feedback ,stress_level,sleep_efficiency,
      confidence_level,therapy ,benefit} = req.body;

    const chatbotInput = new ChatbotInput({
      heartrate,
      Sleephours,
      Awakenings,
      Alcoholconsumption,
      Smokingstatus,
      feedback,
      user_id,
      fullName,
      email,
      stress_level,
      situation_feedback,
      sleep_efficiency,
      confidence_level,
      therapy,
      benefit
    });
    console.log(chatbotInput)
    const savedChatbotInput = await chatbotInput.save();
    res.status(201).json(savedChatbotInput);
  } catch (error) {
    console.error('Error creating chatbot input:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get chatbot input records where startdate is 5 days before the current date and enddate is today
exports.getChatbotInputs = async (req, res) => {
    const {user_id} = req.params;
    try {
      // Calculate the date 5 days ago from the current date
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  
      // Find records with startdate 5 days before the current date and enddate as today
      const chatbotInputs = await ChatbotInput.find({
        user_id: user_id,
        createdAt: {
            $gte: fiveDaysAgo, // Greater than or equal to 5 days ago
            $lte: new Date() // Less than or equal to today
        }
      });


      const stressLevelsCount = {
        'low-normal': 0,
        'medium low': 0,
        'medium': 0,
        'medium high': 0,
        'high': 0,
      };
    
      for (const entry of chatbotInputs) {
        const stressLevel = entry.stress_level;
        if (stressLevelsCount.hasOwnProperty(stressLevel)) {
          stressLevelsCount[stressLevel]++;
        }
      }
    
      let mostCommonStressLevel = '';
      let maxCount = 0;
    
      for (const level in stressLevelsCount) {
        if (stressLevelsCount[level] > maxCount) {
          maxCount = stressLevelsCount[level];
          mostCommonStressLevel = level;
        }
      }

      // Filter the data to include only entries with the most common stress level
      const filteredData = chatbotInputs.filter(entry => entry.stress_level === mostCommonStressLevel);
  
      res.json({
        mostCommonStressLevel,
        filteredData,
      });

    } catch (error) {
      console.error('Error fetching chatbot inputs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

// Get a specific chatbot input record by ID
exports.getChatbotInputById = async (req, res) => {
  try {
    const chatbotInput = await ChatbotInput.findById(req.params.id);
    if (!chatbotInput) {
      return res.status(404).json({ error: 'Chatbot input not found' });
    }
    res.json(chatbotInput);
  } catch (error) {
    console.error('Error fetching chatbot input by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a chatbot input record by ID
exports.updateChatbotInput = async (req, res) => {
  try {
    const { heartrate, Sleephours, Awakenings, Alcoholconsumption, Smokingstatus, feedback } = req.body;

    const chatbotInput = await ChatbotInput.findById(req.params.id);
    if (!chatbotInput) {
      return res.status(404).json({ error: 'Chatbot input not found' });
    }

    chatbotInput.heartrate = heartrate;
    chatbotInput.Sleephours = Sleephours;
    chatbotInput.Awakenings = Awakenings;
    chatbotInput.Alcoholconsumption = Alcoholconsumption;
    chatbotInput.Smokingstatus = Smokingstatus;
    chatbotInput.feedback = feedback;

    const updatedChatbotInput = await chatbotInput.save();
    res.json(updatedChatbotInput);
  } catch (error) {
    console.error('Error updating chatbot input:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a chatbot input record by ID
exports.deleteChatbotInput = async (req, res) => {
  try {
    const chatbotInput = await ChatbotInput.findByIdAndRemove(req.params.id);
    if (!chatbotInput) {
      return res.status(404).json({ error: 'Chatbot input not found' });
    }
    res.json({ message: 'Chatbot input deleted' });
  } catch (error) {
    console.error('Error deleting chatbot input:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Get last 5 days' stress levels for a user
exports.getLastFiveDaysStressLevels = async (req, res) => {
  const { user_id } = req.params;
  try {
    // Find the latest stress level entries for the user using the updatedAt column
    const latestStressLevels = await ChatbotInput
      .find({ user_id })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('stress_level updatedAt');

    if (!latestStressLevels || latestStressLevels.length === 0) {
      return res.status(200).json({ latestStressLevels: 'empty' });
    }

    // Extract stress levels and timestamps
    const stressData = latestStressLevels.map((entry) => ({
      stress_level: entry.stress_level,
      timestamp: entry.updatedAt,
    }));

    apiResponse.Success(res, "latestStressLevels", { user_id, stress_data: stressData });
  } catch (error) {
    console.error('Error fetching the last 5 days stress levels:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getLastFiveDaysChatbotInputs = async (req, res) => {
  const { user_id } = req.params;
  try {
    // Calculate the date 5 days ago from the current date
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    // Find the latest ChatbotInput records for the user within the last 5 days
    const latestChatbotInputs = await ChatbotInput
      .find({
        user_id,
        createdAt: {
          $gte: fiveDaysAgo, // Greater than or equal to 5 days ago
          $lte: new Date(), // Less than or equal to today
        }
      })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .limit(5); // Limit the results to the last 5 records

    if (!latestChatbotInputs || latestChatbotInputs.length === 0) {
      return res.status(200).json({ latestChatbotInputs: 'empty' });
    }

    // Send the latest chatbot input data
    apiResponse.Success(res, "latestChatbotInputs", { user_id, chatbot_inputs: latestChatbotInputs });
  } catch (error) {
    console.error('Error fetching the last 5 days chatbot inputs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getLastDayChatbotInput = async (req, res) => {
  const { user_id } = req.params;
  try {
    // Calculate the date for the previous day from the current date
    const previousDay = new Date();
    previousDay.setDate(previousDay.getDate() - 1);

    // Find the latest ChatbotInput record for the user from the previous day
    const latestChatbotInput = await ChatbotInput
      .findOne({
        user_id,
        createdAt: {
          $gte: previousDay, // Greater than or equal to the previous day
          $lt: new Date(), // Less than today (current day)
        }
      })
      .sort({ createdAt: -1 }); // Sort by createdAt in descending order to get the latest

    if (!latestChatbotInput) {
      return res.status(200).json({ latestChatbotInput: 'empty' });
    }

    // Send the latest chatbot input data for the previous day
    apiResponse.Success(res, "latestChatbotInput", { user_id, chatbot_input: latestChatbotInput });
  } catch (error) {
    console.error('Error fetching the last day chatbot input:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
