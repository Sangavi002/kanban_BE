const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connection = require("./config/db")
const userRouter = require("./route/user.route")
const taskRouter = require("./route/task.route")
const jwt = require("jsonwebtoken")

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/user", userRouter);
app.use("/task", taskRouter);

app.get("/", (req, res) => {
    res.status(200).send("Health Check.")
})

app.post("/token",(req,res) => {
    const refreshToken = req.body.token;
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded) => {
        if(err){
            res.send("Error occured.")
        }else{
            let accessToken = jwt.sign({id: decoded.id},process.env.JWT_SECRET,{expiresIn: "30m"}) 
            res.send({accessToken}) 
        }
    })
})

app.listen(port, async() =>{
    try{
        await connection;
        console.log(`Server is running on port ${port} and DB is connected.`)
    }catch(err){
        console.log(err)
    }
})