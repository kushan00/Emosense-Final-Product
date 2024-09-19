const express = require("express");
const router = express.Router();
const { createTask, getAllTasks, getOneTask, getUserTasks, updateTask, deleteTask } = require("../controllers/taskController.js")

router.post("/create-task",createTask)
router.get("/all-tasks",getAllTasks)
router.get("/:id",getOneTask)
router.get("/user-tasks/:userId",getUserTasks)
router.put("/update-task/:id",updateTask)
router.delete("/delete-task/:id",deleteTask)

module.exports = router
