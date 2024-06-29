const express = require("express");
const taskRouter = express.Router();
const auth = require("../middleware/auth.middleware")
const {createTask, updateTask, deleteTask, allTask} = require("../controller/task.controller")

taskRouter.post("/createTask",auth, createTask)

taskRouter.patch("/updateTask/:taskId", auth, updateTask );

taskRouter.delete("/deleteTask/:taskId",auth, deleteTask)

taskRouter.get("/allTask", auth, allTask)

module.exports = taskRouter
