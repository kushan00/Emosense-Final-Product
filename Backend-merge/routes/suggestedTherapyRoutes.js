const express = require('express');
const suggestedTherapyController = require('../controllers/suggestedTherapyController');
const router = express.Router();

// Create a new suggested therapy recommendation
router.post('/new-suggested-therapy', suggestedTherapyController.createSuggestedTherapy);

// Get all suggested therapy recommendations with user and therapy details
router.get('/all-suggested-therapies', suggestedTherapyController.getAllSuggestedTherapies);

// Get suggested therapy recommendations for a specific user
router.get('/suggested-therapies-by-user/:user_id', suggestedTherapyController.getAllSuggestedTherapiesByUser);




module.exports = router;
