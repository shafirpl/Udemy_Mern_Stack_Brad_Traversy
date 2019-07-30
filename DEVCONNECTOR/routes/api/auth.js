const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");

const User = require ('../../models/Users');
/*
* @route GET api/auth
* @description: Test route
* @access Public
* so recall from node js lessions,
* we define middleware in a seperate file, and
* then import it and then put it in the routes,
* the next function in the middleware will pass
* the controls to this function if the middleware is 
* successful
*/
router.get('/',auth, async (req,res) => {
    try{
        /*
        * select("-password") will leave off the password

        * since we were passing the id in the payload in jwt
        * when we were sending it to generate the jwt, and so after
        * generating the token in the server
        * and getting the token, and after decoding,
        * we can grab the id. Also since remember if auth passes,
        * it will run the next function, which will in turn 
        * execute this funciton, so this function will have access 
        * to that req, and we did req.uder = decoded.user so
        * by doing req.user.id, we would have access to the id
        * 
        */
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);

    } catch(err){
        console.error(err.message);
        res.status(500).send("server error");
    }
});

module.exports = router;