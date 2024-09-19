const express = require('express');
const chatbotInputController = require('../controllers/ChatbotInputController');

const router = express.Router();

// Create a new chatbot input record
router.post('/chatbotinput-insert', chatbotInputController.createChatbotInput);

// Get all chatbot input records
router.get('/chatbotinput-get/:user_id', chatbotInputController.getChatbotInputs);

// Get a specific chatbot input record by ID
router.get('/get/:user_id', chatbotInputController.getChatbotInputById);

// Update a chatbot input record by ID
router.put('/update/:id', chatbotInputController.updateChatbotInput);

// Delete a chatbot input record by ID
router.delete('/delete/:id', chatbotInputController.deleteChatbotInput);

// Get last 5 days stress levels
router.get('/last-five-days-stress-levels/:user_id', chatbotInputController.getLastFiveDaysStressLevels);

// Get last 5 days inputs
router.get('/last-five-days-inputs/:user_id', chatbotInputController.getLastFiveDaysChatbotInputs);

// Get last day input
router.get('/lastday-input/:user_id', chatbotInputController.getLastDayChatbotInput);

module.exports = router;
