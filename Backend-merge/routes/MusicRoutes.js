const express = require("express");
const router = express.Router();
const {saveMusic, getMusicByID, deleteMusic} = require("../controllers/MusicController");


router.post("/save-music",saveMusic);
router.get("/get-music-by-id/:user_id",getMusicByID);
router.delete("/delete-music/:id",deleteMusic)


module.exports = router;
