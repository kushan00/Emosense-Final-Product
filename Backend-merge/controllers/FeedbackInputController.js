const FeedbackInput = require('../models/FeedbackInputModel');

// Controller to handle the creation of new feedback input
const createFeedbackInput = async (req, res) => {
  try {
    const {
      user_id,
      fullName,
      email,
      date,
      suggested_therapy,
      feedback_of_therapy,
      rate,
    } = req.body;

    // Create a new feedback input instance
    const feedbackInput = new FeedbackInput({
      user_id,
      fullName,
      email,
      date,
      suggested_therapy,
      feedback_of_therapy,
      rate,
    });

    // Save the feedback input to the database
    await feedbackInput.save();

    res.status(201).json({ message: 'Feedback input created successfully' });
  } catch (error) {
    console.error('Error creating feedback input:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to get all feedback inputs
const getAllFeedbackInputs = async (req, res) => {
  try {
    const feedbackInputs = await FeedbackInput.find();
    res.status(200).json(feedbackInputs);
  } catch (error) {
    console.error('Error getting feedback inputs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to get a specific feedback input by ID
const getFeedbackInputById = async (req, res) => {
  const { id } = req.params;
  try {
    const feedbackInput = await FeedbackInput.findById(id);
    if (!feedbackInput) {
      return res.status(404).json({ error: 'Feedback input not found' });
    }
    res.status(200).json(feedbackInput);
  } catch (error) {
    console.error('Error getting feedback input by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to update a feedback input by ID
const updateFeedbackInput = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedFeedbackInput = await FeedbackInput.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updatedFeedbackInput) {
      return res.status(404).json({ error: 'Feedback input not found' });
    }
    res.status(200).json(updatedFeedbackInput);
  } catch (error) {
    console.error('Error updating feedback input by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to delete a feedback input by ID
const deleteFeedbackInput = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedFeedbackInput = await FeedbackInput.findByIdAndRemove(id);
    if (!deletedFeedbackInput) {
      return res.status(404).json({ error: 'Feedback input not found' });
    }
    res.status(204).json(); // No content to send for a successful deletion
  } catch (error) {
    console.error('Error deleting feedback input by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createFeedbackInput,
  getAllFeedbackInputs,
  getFeedbackInputById,
  updateFeedbackInput,
  deleteFeedbackInput,
};
