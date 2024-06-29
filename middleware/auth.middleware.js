const jwt = require("jsonwebtoken");
const BlacklistedTokenModel = require("../model/blacklisted.model")

const auth = async(req,res,next) => {
    let token = req.headers.authorization?.split(" ")[1];
    const isBlacklisted = await BlacklistedTokenModel.exists({ token });
    if (isBlacklisted) {
        return res.send("You are blacklisted, Please login again.");
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        console.log(decoded);
        req.body.userId = decoded.id;
        next();
    }catch(err){
        res.status(404).send("You are not authenticated.")
    }
}

module.exports= auth