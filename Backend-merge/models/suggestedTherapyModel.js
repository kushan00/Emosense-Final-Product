const mongoose = require('mongoose');

const suggestedTherapySchema = new mongoose.Schema({
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
  position: {
    type: String,
    required: true,
  },
  stress_level: {
    type: String,
    required: true,
  },
  therapy: {
    type: String,
    required: true,
  },
});

const SuggestedTherapy = mongoose.model('SuggestedTherapy', suggestedTherapySchema);

module.exports = SuggestedTherapy;
