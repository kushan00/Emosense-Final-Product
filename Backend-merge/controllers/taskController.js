const Task = require('../models/taskModel.js')
const apiResponse = require("../helpers/apiResponse");


const createTask = async (req,res) => {
    const {
        name,
        description,
        status,
        assignedTo
    } = req.body

    try {
        const task = new Task({
            name: name,
            description : description,
            status : status,
            assignedTo : assignedTo
        })
        console.log("task is", task);

        await task.save()

        apiResponse.Success(res,"Task created Sucessfully",{task:task})
       
    } catch (err) {
        console.error(err);
        apiResponse.ServerError(res,"Server Error",{err:err});
    }
}

const getAllTasks = async (req,res) => {
    try {
        const tasks = await Task.find();
        apiResponse.Success(res,"All Tasks Retrive Success",{tasks: tasks });
      } catch (error) {
        apiResponse.ServerError(res,"Server Error",{err:error});
    }
}

const getOneTask = async (req,res) => {
    try {
        const task = await Task.findById(req.params.id);
        apiResponse.Success(res,"Task Retrive Success",{task: task });
      } catch (error) {
        apiResponse.ServerError(res,"Server Error",{err:error});
    }
}

const getUserTasks = async (req, res) => {
    try {
      const userId = req.params.userId; // Assuming you pass the userId as a parameter in the route
      
      const tasks = await Task.find({ assignedTo: userId });
      apiResponse.Success(res, "Tasks Assigned to User Retrieved Successfully", { tasks: tasks });
    } catch (error) {
      apiResponse.ServerError(res, "Server Error", { err: error });
    }
};
  
const updateTask = async (req, res) => {
    try {
      const taskId = req.params.id;
      const { name, description, status, assignedTo } = req.body
      const updateData ={
        name: name,
        description: description,
        status: status,
        assignedTo: assignedTo
      } // Assuming you send the updated data in the request body
      
      const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true });
      
      if (!updatedTask) {
        return apiResponse.NotFound(res, "Task not found");
      }
      
      apiResponse.Success(res, "Task Updated Successfully", { task: updatedTask });
    } catch (error) {
      apiResponse.ServerError(res, "Server Error", { err: error });
    }
};  

const deleteTask = async (req, res) => {
    try {
      const taskId = req.params.id;
      
      const deletedTask = await Task.findByIdAndDelete(taskId);
      
      if (!deletedTask) {
        return apiResponse.NotFound(res, "Task not found");
      }
      
      apiResponse.Success(res, "Task Deleted Successfully", { task: deletedTask });
    } catch (error) {
      apiResponse.ServerError(res, "Server Error", { err: error });
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getOneTask,
    getUserTasks,
    updateTask,
    deleteTask
}