const HeartRate = require("../models/heartRateModel.js");
const apiResponse = require("../helpers/apiResponse");



const saveHeartRate = async (req, res) => {
  
  const { 
    user_id, 
    fullName, 
    _id, 
    heart_rate,    
    email
} = req.body;
console.log(req.body);

try {

  let user = await HeartRate.findOne({user_id:user_id});

  if(user){
      const filter = { _id: _id };
      const update = { 
            user_id:user_id, 
            fullName:fullName, 
            _id:_id, 
            heart_rate:heart_rate,    
            email:email   
          };   
      
      let data = await HeartRate.findOneAndUpdate(filter, update);

      apiResponse.Success(res,"Add New HeartRate Success",{heartRate: data});
  }
  else
  {
    
      let heartRate = new HeartRate({
          user_id, 
          fullName, 
          _id, 
          heart_rate,
          email
      });

      await heartRate.save();

      console.log("heartRate ",heartRate);
      
      apiResponse.Success(res,"Add New HeartRate Success",{heartRate: heartRate});
  }


    } catch (err) {
    console.error(err);
    apiResponse.ServerError(res,"Server Error",{err:err});
    }
};



const passHeartRateById = async (req, res) => {

      const userId = req.params.user_id; // Assuming the user_id is in req.params as 'id'

      console.log(userId);

      // Calculate the current date and time
      const currentDate = new Date();
    
      // Find the latest heart rate document for the given user ID
      HeartRate.findOne({ user_id: userId })
        .sort({ updatedAt: -1 }) // Sort by updatedAt in descending order to get the latest entry first
        .exec((err, heartRateData) => {
          if (err) {
            apiResponse.ServerError(res,"Server Error",{err:err});
          }
          console.log(heartRateData)
          
          if (!heartRateData) {
            apiResponse.NotFound(res,"Server Error",{err:'Heart rate data not found for the user'});
          }
          
          // Check if updatedAt is close to the current date and time
          const updatedAt = new Date(heartRateData.updatedAt);
          const timeDifference = Math.abs(currentDate - updatedAt);
    
          // Define a threshold for how close updatedAt should be to currentDate (in milliseconds)
          const threshold = 60 * 60 * 1000; // 1 hour
    
          if (timeDifference <= threshold) {
            apiResponse.Success(res,"Add New HeartRate Success",{heartRateData: heartRateData});
          } else {
            apiResponse.NotFound(res,"Server Error",{err:'Heart rate data not found for the user'});
          }
        });
  };






module.exports = {
    saveHeartRate,
    passHeartRateById
};
