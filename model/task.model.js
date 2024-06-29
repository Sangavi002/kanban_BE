const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    assignee: {type: String, required: true},
    status:{type: String, required: true},
    duedate: {type: Date, required: true},
},{
    versionKey: false,
    timestamps: true
})

const TaskModel = mongoose.model("task", taskSchema)

module.exports = TaskModel