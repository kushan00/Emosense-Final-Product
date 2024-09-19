const mongoose = require('mongoose');

const feedbackInputSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  suggested_therapy: {
    type: String,
    required: true,
  },
  feedback_of_therapy: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
});

const FeedbackInput = mongoose.model('FeedbackInput', feedbackInputSchema);

module.exports = FeedbackInput;
