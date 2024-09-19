const mongoose = require("mongoose");

const SavedMusicSchema = new mongoose.Schema({
    user_id: {
		type: String,
		required: true,
	},
	song_name: {
		type: String,
		required: true,
	},
	music_url: {
		type: String,
		required: true,
	},
	song_id: {
		type: String,
		required: true,
	},
},
{
    timestamps: true,
}
);

module.exports = SavedMusic = mongoose.model("savedMusic", SavedMusicSchema);