const mongoose = require("mongoose");

const HeartRateSchema = new mongoose.Schema({
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
	heart_rate: {
		type: String,
		required: true,
	},
    _id: {
		type: String,
		required: true,
	},
},
{
    timestamps: true,
}
);

module.exports = HeartRate = mongoose.model("heartRate", HeartRateSchema);