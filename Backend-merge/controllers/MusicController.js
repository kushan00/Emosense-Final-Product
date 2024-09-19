const SavedMusic = require("../models/SavedMusics");
const apiResponse = require("../helpers/apiResponse");
const mongoose = require("mongoose");

const saveMusic = async (req, res) => {
  const { user_id, song_name, music_url, song_id } = req.body;
  console.log(req.body);

  try {
    let savedMusic = new SavedMusic({
      user_id,
      song_name,
      music_url,
      song_id,
    });

    await savedMusic.save();

    apiResponse.Success(res, "Music Save Success", {
      savedMusic: savedMusic,
    });
  } catch (err) {
    console.error(err);
    apiResponse.ServerError(res, "Server Error", { err: err });
  }
};

const getMusicByID = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const songs = await SavedMusic.find({ user_id: userId });
    apiResponse.Success(res, "All songs Success", { songs: songs });
  } catch (error) {
    apiResponse.ServerError(res, "Server Error", { err: error });
  }
};

const deleteMusic = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiResponse.BadRequest(res, "Invalid music ID");
    }

    const objectId = mongoose.Types.ObjectId(id); // Convert the string to ObjectId
    const deletedMusic = await SavedMusic.findByIdAndDelete(objectId);

    if (!deletedMusic) {
      return apiResponse.NotFound(res, "Music not found");
    }

    apiResponse.Success(res, "Music Deleted Successfully", { music: deletedMusic });
  } catch (error) {
    apiResponse.ServerError(res, "Server Error", { err: error });
  }
};


module.exports = {
  saveMusic,
  getMusicByID,
  deleteMusic
};
