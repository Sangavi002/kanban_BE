const TaskModel = require("../model/task.model");
const UserModel = require("../model/user.model")

const createTask = async(req,res) =>{
    const {title, description, assignee, status, duedate} = req.body;
    try{
        const regularUser = await UserModel.findOne({username: assignee});
        
        if (!regularUser) {
            return res.status(404).send({ msg: "Regular user not found." });
        }
       
        const task = new TaskModel({title, description, assignee:regularUser.username, status, duedate});
        await task.save();
        res.status(200).send({"msg": "New task is created."})
    }catch(err){
        res.status(200).send({"msg": "Failed to create new task."})
    }
}

const updateTask = async (req, res) => {
    const { title, description, assignee, status, duedate } = req.body;
    const { taskId } = req.params;

    try {
        const task = await TaskModel.findOne({ _id: taskId });

        if (!task) {
            return res.status(404).send("Task not found.");
        }
        const user = await UserModel.findOne({ _id: req.body.userId});
       
        if (!user) {
            return res.status(404).send("User not found.");
        }
    
        if (user.role === "regular" && user.username == task.assignee ) {
            await TaskModel.updateOne({ _id: taskId }, { $set: { status } });
            return res.status(200).send({ "msg": "Status updated successfully." });

        } else if (user.role === "admin"){
           const assigneeUser = await UserModel.findOne({ username: assignee });

            await TaskModel.updateOne({ _id: taskId }, { $set: { title, description, assignee: assigneeUser._id, status, duedate } });
            return res.status(200).send({ "msg": "Task updated successfully." });
        } else {
            return res.status(403).send("Unauthorized to update task.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error in updating task.");
    }
}

const deleteTask = async(req,res) => {
    const {taskId} = req.params;
    try{
        const task = await TaskModel.findByIdAndDelete({_id: taskId})
        res.status(200).send({"msg": "Task deleted successfully."})
    }catch(err){
        res.status(404).send("Error in deleting task.")
    }
}

const allTask = async(req,res) => {
    try{
        const request = req.body;
       
        let task;
        const user = await UserModel.find({_id: request.userId})
        // console.log(request.userName)
        if(user[0].role == "regular"){
             task = await TaskModel.find({ assignee: user[0].username});
        }else{
            task = await TaskModel.find();
        }
        res.status(200).send(task)
    }catch(err){
        res.status(404).send("Error in getting all task.")
    }
}

module.exports = {createTask, updateTask, deleteTask, allTask}