import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskTable from '../../components/task/TaskTable';
import TaskForm from '../../components/task/TaskForm';
import { AddNewTasks, DeleteTask, GetAllTasks, UpdateTaskData } from '../../services/TaskServices';
import { GetAllUserDetails } from '../../services/UserServices';
import { Box, Button, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import Swal from 'sweetalert2';


const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    useEffect(() => {
      fetchTasks();
      fetchUsers();
    }, []);
  
    const fetchTasks = async () => {
        try {
          // const response = await axios.get('/api/tasks'); 
          const response = await GetAllTasks();
          console.log("all tasks are", response)
          const newData = response?.data?.data?.tasks?.map((item) => {
            return {
              name: item?.name,
              description: item?.description,
              status: item?.status,
              assignedTo: item?.assignedTo,
              _id: item?._id,
            }
          })
          console.log("After tasks are", newData)
          setTasks(newData);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
    };

    const fetchUsers = async () => {
        try {
          const response = await GetAllUserDetails();
          console.log("All users", response)
          const newData = response?.data?.data?.users?.map((item) => {
            return {
              fullName: item?.fullName,
              email: item?.email,
              mobileno: item?.mobileno,
              _id: item?._id,
            }
          })
          setUsers(newData);
          console.log("after user data", newData)
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
  
    const handleEdit = (task) => {
      const clickedTask = tasks.find(t => t._id === task._id )
      console.log("clicked task", clickedTask)
      setSelectedTask(clickedTask);
      setIsEdit(true);
      setOpenForm(true);
    };
  
    const handleDelete = async (taskId) => {
      try {
        // await axios.delete(`/api/tasks/${taskId}`);
        let data = await DeleteTask(taskId);
        console.log(data)
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    };

    const handleFormOpen = (task = null) => {
        setSelectedTask(task);
        setIsEdit(false);
        setOpenForm(true);
    };

    const handleFormClose = () => {
        setSelectedTask(null);
        setOpenForm(false);
    };
    
    const handleFormSubmit = async (taskData) => {
        try {
          if (selectedTask) {
            // await axios.put(`/api/tasks/${selectedTask._id}`, taskData);
            // let data=await UpdateTaskData({...taskData, _id: selectedTask?._id});
            let data = await UpdateTaskData(selectedTask?._id, taskData);
            setIsEdit(false)
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: "Task Edited Successfully",
            });
            console.log("task to update", data)
          } else {
            // await axios.post('/api/tasks', taskData);
            let data = await AddNewTasks(taskData);
            setIsEdit(false)
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: "Task Added Successfully",
            });
            console.log("new task is", data)
          }
          fetchTasks();
          handleFormClose();
        } catch (error) {
          console.error('Error submitting task:', error);
        }
    };
  
    return (
      <div>
        <Box m="20px">
          <Header title="All Task Page" subtitle="Welcome to Emosense" />
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              mb: "20px",
            }}
            onClick={() => handleFormOpen()}
          >
            Add Task
          </Button>
          <TaskTable
            tasks={tasks}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
          <TaskForm
            open={openForm}
            isEdit={isEdit}
            handleClose={handleFormClose}
            handleSubmit={handleFormSubmit}
            initialData={
              selectedTask
                ? selectedTask
                : {
                    name: "",
                    description: "",
                    status: "in-progress",
                    assignedTo: "",
                  }
            }
            users={users}
          />
        </Box>
      </div>
    );
  };
  
  export default Tasks;
  