const jwt = require("jsonwebtoken");
const config = require("config");

/*
* Remember from middleware functions in node.js
* that they take three things, req,res and next
* if something passes, then the next thing happens
* which in most cases transfers the control to 
* another function
*
* x-auth-token: https://stackoverflow.com/questions/39017297/what-is-difference-between-x-auth-token-vs-authorisation-headers-which-is-prefer
* 
*/
module.exports = (req,res,next) => {
    // Get token from the header
    const token = req.header('x-auth-token');

    // check if no token

    if(!token){
        // 401 is unathorized access error http code
        return res.status(401).json({msg:"No token, authorization denied"});

    }

    // if there is token, verify it
    try{
        // console.log(token);
        // decoding the token
        const decoded = jwt.verify(token, config.get("jwtSecret"));

        req.user = decoded.user;
        next();
    } catch(err){
        // this will happen if the token is not valid
        // res.send(err);
        return res.status(401).json({msg:"Token is not valid"});
    }
}