const express = require("express");
const therapyController = require("../controllers/therapyController");
const router = express.Router();

// Create a new therapy recommendation
router.post("/new-therapy", therapyController.createTherapy);

// Get all therapy recommendations
router.get("/all-therapy", therapyController.getTherapies);

// Get a specific therapy recommendation by ID
router.get("/getone-therapy/:id", therapyController.getTherapyById);

// Update a therapy recommendation by ID
router.put("/update-therapy/:id", therapyController.updateTherapy);

// Delete a therapy recommendation by ID
router.delete("/delete-therapy/:id", therapyController.deleteTherapy);

// Endpoint to get a random therapy recommendation based on stress level
router.get('/random/:predicted_stress', therapyController.getRandomTherapy);

module.exports = router;
