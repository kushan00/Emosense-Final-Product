const Therapy = require("../models/therapyModel");
const apiResponse = require("../helpers/apiResponse");

const createTherapy = async (req, res) => {
  const { therapy, stress_level, benefits } = req.body;

  try {
    const newTherapy = new Therapy({
      therapy,
      stress_level,
      benefits,
    });

    const savedTherapy = await newTherapy.save();

    apiResponse.Success(res, "Therapy Recommendation Created", {
      therapy: savedTherapy,
    });
  } catch (error) {
    apiResponse.ServerError(res, "Server Error", { error });
  }
};

const getTherapies = async (req, res) => {
  try {
    const therapies = await Therapy.find();
    apiResponse.Success(res, "All Therapy Recommendations Retrieved", {
      therapies,
    });
  } catch (error) {
    apiResponse.ServerError(res, "Server Error", { error });
  }
};

const getTherapyById = async (req, res) => {
  const { id } = req.params;

  try {
    const therapy = await Therapy.findById(id);
    if (!therapy) {
      apiResponse.NotFound(res, "Therapy Recommendation Not Found");
    } else {
      apiResponse.Success(res, "Therapy Recommendation Retrieved", { therapy });
    }
  } catch (error) {
    apiResponse.ServerError(res, "Server Error", { error });
  }
};

const updateTherapy = async (req, res) => {
  const { id } = req.params;
  const { therapy, stress_level, benefits } = req.body;

  try {
    const updatedTherapy = await Therapy.findByIdAndUpdate(
      id,
      {
        therapy,
        stress_level,
        benefits,
      },
      { new: true }
    );

    if (!updatedTherapy) {
      apiResponse.NotFound(res, "Therapy Recommendation Not Found");
    } else {
      apiResponse.Success(res, "Therapy Recommendation Updated", {
        therapy: updatedTherapy,
      });
    }
  } catch (error) {
    apiResponse.ServerError(res, "Server Error", { error });
  }
};

const deleteTherapy = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTherapy = await Therapy.findByIdAndDelete(id);
    if (!deletedTherapy) {
      apiResponse.NotFound(res, "Therapy Recommendation Not Found");
    } else {
      apiResponse.Success(res, "Therapy Recommendation Deleted", {
        therapy: deletedTherapy,
      });
    }
  } catch (error) {
    apiResponse.ServerError(res, "Server Error", { error });
  }
};

const getRandomTherapy = async (req, res) => {
  const { predicted_stress } = req.params;

  try {
    // Map the predicted stress level to therapy category
    const therapyCategoryMap = {
      'low-normal': 'Low Stress',
      'medium low': 'Low Stress',
      'medium': 'Medium stress',
      'medium high': 'High Stress',
      'high': 'High Stress',
    };
    console.log('stress Level :',predicted_stress)

    // Get the therapy category based on the predicted stress level
    const therapyCategory = therapyCategoryMap[predicted_stress];

    console.log('therapy category :',therapyCategory)

    // Fetch all therapies with the matching stress level category
    const therapies = await Therapy.find({ stress_level: therapyCategory });
    console.log('Fetched Therapies:', therapies);

    // Choose a random therapy from the list
    const randomIndex = Math.floor(Math.random() * therapies.length);
    const randomTherapy = therapies[randomIndex];
    console.log('Random Therapy:', randomTherapy);

    res.json(randomTherapy);
  } catch (error) {
    console.error('Error fetching therapies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createTherapy,
  getTherapies,
  getTherapyById,
  updateTherapy,
  deleteTherapy,
  getRandomTherapy,
};
