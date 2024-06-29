const UserModel =  require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const auth = require("../middleware/auth.middleware")
const BlacklistedTokenModel = require("../model/blacklisted.model")


const register = async(req,res) => {
    const {username,email,password,role} = req.body;
    try{
        const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).send({ "msg": "Username or email already exists." });
        }
        
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err){
                res.status(404).send("Something went wrong");
            }else{
                const user = new UserModel({username,email,password:hash,role});
                await user.save()
                res.status(200).send({"msg": "New user has been registerd."})
            }
        }) 
    }catch(err) {
        res.status(404).send({"msg": "Registration is failed."})
    }
}

const login = async(req,res) => {
    const {email,password} = req.body;
    try{
        const user = await UserModel.findOne({email});
        if (user){
            bcrypt.compare(password,user.password,(err,result) => {
                if(err){
                    res.status(404).send("Something went wrong.");
                }if(result){
                    let accessToken = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: "30m"});
                    let refreshToken = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: "24h"});
                    res.status(200).send({"msg": "Logged In successfully.", "accessToken": accessToken, "refreshToken":refreshToken, "role": user.role})
                }else{
                    res.status(404).send({"msg": "Wrong password."})
                }
            })
        }else{
            res.status(200).send({"msg": "Wrong crendentails or you need to login first."}) 
        }
    }catch(err){
        res.status(404).send({"msg": "Logged In  is failed."})
    }
}

const logout = async(req,res) => {
    try {
        let token = req.headers.authorization?.split(' ')[1];
        
        await BlacklistedTokenModel.create({ token });
        res.status(200).send({ "msg": "Logged out successfully" });
    } catch (error) {
        res.status(500).send({ "msg": "Internal Server Error" });
    }
}

module.exports = {register,login,logout}