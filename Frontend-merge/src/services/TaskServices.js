import axios from "axios";

import StartUrl from "../configs/Url.json";

const CreateTaskUrl = StartUrl?.StartUrl + "/emosense/task/create-task";
const GetAllTasksUrl = StartUrl?.StartUrl + "/emosense/task/all-tasks";
const GetOneTaskUrl = StartUrl?.StartUrl + "/emosense/task/";
const GetUserTasksUrl = StartUrl?.StartUrl + "/emosense/task/user-tasks/";
const UpdateTaskUrl = StartUrl?.StartUrl + "/emosense/task/update-task/";
const DeleteTaskUrl = StartUrl?.StartUrl + "/emosense/task/delete-task/";

export async function AddNewTasks(data){
    const alldata = {
        name:data?.name,
        description:data?.description,
        status:data?.status,
        assignedTo:data?.assignedTo
    
    }

    let result;
    await  axios.post(CreateTaskUrl,alldata)
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

export async function GetAllTasks(){
    let result;
    await  axios.get(GetAllTasksUrl)
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

export async function GetOneTaskDetails(id){
    let result;
    await  axios.get(GetOneTaskUrl + id)
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

export async function GetUserTasks(id){
    let result;
    await  axios.get(GetUserTasksUrl + id)
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

export async function UpdateTaskData(id,data) {
    const alldata = {
        name:data?.name,
        description:data?.description,
        status:data?.status,
        assignedTo:data?.assignedTo
    };
    
    return await axios.put(UpdateTaskUrl + id, alldata);
  
}

// export async function UpdateTaskData(id, data) {
//   const patchData = [];

//   if (data.name !== undefined) {
//     patchData.push({ op: 'replace', path: '/name', value: data.name });
//   }

//   if (data.description !== undefined) {
//     patchData.push({ op: 'replace', path: '/description', value: data.description });
//   }

//   if (data.status !== undefined) {
//     patchData.push({ op: 'replace', path: '/status', value: data.status });
//   }

//   if (data.assignedTo !== undefined) {
//     patchData.push({ op: 'replace', path: '/assignedTo', value: data.assignedTo });
//   }

//   try {
//     const response = await axios.patch(UpdateTaskUrl + id, patchData, {
//       headers: {
//         'Content-Type': 'application/json-patch+json',
//       },
//     });

//     console.log("response for update", response)
//     return response.data;
//   } catch (error) {
//     // Handle error appropriately
//     console.error('Error updating task:', error);
//     throw error;
//   }
// }

export async function DeleteTask(id){
    return await axios.delete(DeleteTaskUrl+id);
}