import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, MenuItem, Select, styled, tableCellClasses, Box } from '@mui/material';
import { GetUserTasks, UpdateTaskData } from '../../services/TaskServices';
import Header from '../../components/Header';
import Swal from 'sweetalert2';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  useEffect(() => {
    fetchUserTasks();
  }, []);

  const fetchUserTasks = async () => {
    try {
      // const response = await axios.get('/api/tasks/user');
      const response = await GetUserTasks(localStorage.getItem("user"));
      console.log("user task object is ",response);
      const newData = response?.data?.data?.tasks?.map((item) => {
        return {
          name: item?.name,
          description: item?.description,
          status: item?.status,
          assignedTo: item?.assignedTo,
          _id: item?._id,
        }
      })
      console.log("After user tasks are", newData)
      setTasks(newData);
    } catch (error) {
      console.error('Error fetching user tasks:', error);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      // await axios.put(`/api/tasks/${taskId}`, { status });
      let clickTask = tasks.find( t => t._id === taskId)
      clickTask.status = status
      let new_status = await UpdateTaskData(taskId, clickTask);
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: "Status Changed Successfully",
      });
      console.log("task status is", new_status)
      fetchUserTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div>
      <Box m='20px'>
        <Header title="My Task Page" subtitle="You Have Work To Do" />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                {/* <TableCell>Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <StyledTableRow key={task._id}>
                  <StyledTableCell>{task.name}</StyledTableCell>
                  <StyledTableCell>{task.description}</StyledTableCell>
                  <StyledTableCell>
                    <Select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value)
                      }
                    >
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="done">Done</MenuItem>
                    </Select>
                  </StyledTableCell>
                  {/* <TableCell> */}
                  {/* Additional actions for employees, if needed */}
                  {/* </TableCell> */}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default MyTasks;
