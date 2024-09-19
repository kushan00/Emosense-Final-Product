const mongoose = require('mongoose');

const chatbotInputSchema = new mongoose.Schema({
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
    heartrate: {
        type: Number,
        required: true,
    },
    Sleephours: {
        type: Number,
        required: true,
    },
    Awakenings: {
        type: Number,
        required: true,
    },
    Alcoholconsumption: {
        type: Number,
        required: true,
    },
    Smokingstatus: {
        type: String,
        required: true,
    },
    feedback: {
        type: String,
        required: true,
    },
    situation_feedback: {
        type: String,
        required: true,
    },
    stress_level: {
        type: String,
        required: true,
    },
    sleep_efficiency: {
        type: String,
        required: true,
    },

      confidence_level: {
        type: String,
        required: true,
    },
    therapy: {
        type: String,
        required: true,
    },

    benefit: {
        type: String,
        required: true,
    },
},
{
    timestamps: true,
});

const ChatbotInput = mongoose.model('ChatbotInput', chatbotInputSchema);

module.exports = ChatbotInput;
