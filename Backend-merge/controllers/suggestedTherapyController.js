const SuggestedTherapy = require('../models/suggestedTherapyModel');
const apiResponse = require("../helpers/apiResponse");

// Create a new suggested therapy
const createSuggestedTherapy = async (req, res) => {
  try {
    const {
      user_id,
      fullName,
      email,
      position,
      stress_level,
      therapy,
    } = req.body;

    const suggestedTherapy = new SuggestedTherapy({
      user_id,
      fullName,
      email,
      position,
      stress_level,
      therapy,
    });

    const savedSuggestedTherapy = await suggestedTherapy.save();

    res.status(201).json(savedSuggestedTherapy);
    console.log('success')
  } catch (error) {
    console.error('Error creating suggested therapy:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all suggested therapies
const getAllSuggestedTherapies = async (req, res) => {
  try {
    const suggestedTherapies = await SuggestedTherapy.find();
    res.json(suggestedTherapies);
  } catch (error) {
    console.error('Error fetching suggested therapies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a suggested therapy by ID
const getSuggestedTherapyById = async (req, res) => {
  try {
    const suggestedTherapy = await SuggestedTherapy.findById(req.params.id);
    if (!suggestedTherapy) {
      return res.status(404).json({ error: 'Suggested therapy not found' });
    }
    res.json(suggestedTherapy);
  } catch (error) {
    console.error('Error fetching suggested therapy:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a suggested therapy by ID
const updateSuggestedTherapy = async (req, res) => {
  try {
    const {
      fullName,
      email,
      position,
      stress_level,
      therapy,
    } = req.body;

    const updatedSuggestedTherapy = await SuggestedTherapy.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        email,
        position,
        stress_level,
        therapy,
      },
      { new: true }
    );

    if (!updatedSuggestedTherapy) {
      return res.status(404).json({ error: 'Suggested therapy not found' });
    }

    res.json(updatedSuggestedTherapy);
  } catch (error) {
    console.error('Error updating suggested therapy:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a suggested therapy by ID
const deleteSuggestedTherapy = async (req, res) => {
  try {
    const deletedSuggestedTherapy = await SuggestedTherapy.findByIdAndDelete(
      req.params.id
    );

    if (!deletedSuggestedTherapy) {
      return res.status(404).json({ error: 'Suggested therapy not found' });
    }

    res.json({ message: 'Suggested therapy deleted successfully' });
  } catch (error) {
    console.error('Error deleting suggested therapy:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all suggested therapies with user details and earlier stress levels
const getAllSuggestedTherapiesByUser = async (req, res) => {
  const {user_id} = req.params;
  try {
    // Find the latest therapy using the updatedAt column
    const latestSuggestedTherapy = await SuggestedTherapy.findOne({ user_id }).sort({ updatedAt: -1 });

    if (!latestSuggestedTherapy) {
      return res.status(200).json({ latestSuggestedTherapy: 'empty' });
    }

    apiResponse.Success(res,"latestSuggestedTherapy",{latestSuggestedTherapy: latestSuggestedTherapy });
  } catch (error) {
    console.error('Error fetching the latest suggested therapy:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
  




module.exports = {
  createSuggestedTherapy,
  getAllSuggestedTherapies,
  getSuggestedTherapyById,
  updateSuggestedTherapy,
  deleteSuggestedTherapy,
  getAllSuggestedTherapiesByUser,
  
};
