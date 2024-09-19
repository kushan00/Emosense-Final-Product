const express = require("express");
const router = express.Router();
const {    saveHeartRate, passHeartRateById} = require("../controllers/HeartrateController");


router.post("/create-heart-rate",saveHeartRate);
router.get("/get-by-id/:user_id",passHeartRateById);



module.exports = router;
