import axios from "axios";

import StartUrl from "../configs/Url.json";

const CreateNewUserURL = StartUrl?.StartUrl + "/emosense/user/create-user";
const GetAllUsersURL = StartUrl?.StartUrl + "/emosense/user/all-users";
const GetOneUsersURL = StartUrl?.StartUrl + "/emosense/user/getOne/";
const UpdateUserURL = StartUrl?.StartUrl + "/emosense/user/update-user/";
const DeleteUserUrl = StartUrl?.StartUrl + "/emosense/user/delete-user/";
const getUserHeartrateURL = StartUrl?.StartUrl + "/emosense/health/get-by-id/";


export async function AddNewUsers(data){
    const alldata = {
        fullName:data?.fullName,
        mobileno:data?.mobileno,
        email:data?.email,
        weight:data?.weight,
        dateOfBirth:data?.dateOfBirth,
        height:data?.height
    
    }

    let result;
    await  axios.post(CreateNewUserURL,alldata)
     .then(function(data) {
         //console.log("success data",data)
         result = data;
     })
     .catch(function (error) {
         if (error.response) {
           //console.log(error.response.data);
           result = error.response;
           
         } else if (error.request) {
           //console.log(error.request);
           result = error.request;
         } 
     
       });
  return result;
}

export async function GetAllUserDetails(){
    let result;
    await  axios.get(GetAllUsersURL)
     .then(function(data) {
         //console.log("success data",data)
         result = data;
     })
     .catch(function (error) {
         if (error.response) {
           //console.log(error.response.data);
           result = error.response;
           
         } else if (error.request) {
           //console.log(error.request);
           result = error.request;
         } 
     
       });
  return result;
}

export async function GetOneUserDetails(id){
    let result;
    await  axios.get(GetOneUsersURL + id)
     .then(function(data) {
         //console.log("success data",data)
         result = data;
     })
     .catch(function (error) {
         if (error.response) {
           //console.log(error.response.data);
           result = error.response;
           
         } else if (error.request) {
           //console.log(error.request);
           result = error.request;
         } 
     
       });
  return result;
}

export async function updateUser(id,data) {
  const alldata = {
      fullName: data?.fullName,
      mobileno: data?.mobileno,
      email: data?.email,
      dateOfBirth : data?.dateOfBirth,
      weight : data?.weight,
      height : data?.height 
  };
  
  return await axios.put(UpdateUserURL + id, alldata);

  }
  
export async function DeleteUser(id){
    return await axios.delete(DeleteUserUrl+id);
  }


  export async function getUserHeartRate(id){
    return await axios.get(getUserHeartrateURL+id);
  }
