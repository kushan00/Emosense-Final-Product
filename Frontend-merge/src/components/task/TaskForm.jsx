import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from '@mui/material';
import { useEffect } from 'react';

// ... (previous imports)

const TaskForm = ({ open, isEdit, handleClose, handleSubmit, initialData, users }) => {
    const [taskData, setTaskData] = useState([]);
    const editClicked = isEdit

    // if (!Array.isArray(users)) {
    //   users = []; // Set it to an empty array as a fallback
    // }
    useEffect(() => {
      console.log("opened edit form",initialData)
    }, [open])

    useEffect(() => {
      setTaskData(initialData);
    }, [initialData]);    
    
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setTaskData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleFormSubmit = (e) => {
      e.preventDefault();
      handleSubmit(taskData);
    };
  
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editClicked ? "Edit Task" : "Add Task"}</DialogTitle>
        <DialogContent>

          <TextField
            label="Name"
            name="name"
            value={taskData?.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            name="description"
            value={taskData?.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            multiline
            rows={4}
          />
        {/* Dropdown for selecting status */}
          <TextField
            select
            label="Status"
            name="status"
            margin="normal"
            value={taskData?.status}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </TextField>

        {/* Dropdown for selecting user */}
          <TextField
            select
            label="Assigned To"
            name="assignedTo"
            margin="normal"
            value={taskData?.assignedTo}
            onChange={handleChange}
            fullWidth
            required
          >
            {users.map((user) => (
              <MenuItem key={user._id} value={user.fullName}>
                {user.fullName}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='secondary' onClick={handleClose}>Cancel</Button>
          <Button variant='contained' color='primary' onClick={handleFormSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default TaskForm;  