const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    user_id: {
		type: String,
		required: true,
	},
	fullName: {
		type: String,
		required: true,
	},
	mobileno: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
    dateOfBirth: {
		type: String,
		required: true,
	},
	address: {
		type: String,
        required: true,
	},
	position: {
		type: String,
        required: true,
	},
	status: {
		type: String,
        default:null
	},
	twitterUsername: {
		type: String,
        default:null
	},
    password: {
		type: String,
		required: true,
	}, 
	userRole: {
		type: String,
		default: "user",
	},
	accessToken: {
		type: String,
		default: null,
	},
},
{
    timestamps: true,
}
);

module.exports = User = mongoose.model("user", UserSchema);