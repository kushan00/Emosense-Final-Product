const mongoose = require("mongoose");

const TherapySchema = new mongoose.Schema({
	therapy: {
		type: String,
		required: true,
	},
	stress_level: {
		type: String,
		required: true,
	},
	benefits: {
		type: String,
		required: true,
	},
},
{
    timestamps: true,
}
);

module.exports = Therapy = mongoose.model("therapy", TherapySchema);