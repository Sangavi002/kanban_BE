const express = require("express");
const userRouter = express.Router();
const {register,login,logout} = require("../controller/user.controller");

userRouter.post("/register", register )

userRouter.post("/login", login)

userRouter.get("/logout", logout);


module.exports = userRouter