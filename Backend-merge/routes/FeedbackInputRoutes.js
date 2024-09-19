const express = require('express');
const feedbackInputController = require('../controllers/FeedbackInputController');
const router = express.Router();

// Create a new feedback input
router.post('/feedback-inputs-insert', feedbackInputController.createFeedbackInput);

// Get all feedback inputs
router.get('/feedback-inputs-get', feedbackInputController.getAllFeedbackInputs);

// Get a specific feedback input by ID
router.get('/feedback-inputs-byId/:id', feedbackInputController.getFeedbackInputById);

// Update a feedback input by ID
router.put('/feedback-inputs/:id', feedbackInputController.updateFeedbackInput);

// Delete a feedback input by ID
router.delete('/feedback-inputs/:id', feedbackInputController.deleteFeedbackInput);

module.exports = router;
