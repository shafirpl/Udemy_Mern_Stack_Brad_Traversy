const express = require('express');
const router = express.Router();

const {check, validationResult} = require("express-validator");

/*
* @route POST api/users
* @description: Register user
* @access Public
*
* Here we are running express validator as middleware in the []
* section
* What we are doing here is checking/validating email, password 
* and name, and then creating the user
*/
router.post('/',[
    // this means if the username is empty, send a message saying 
    // name is required
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    check("email","Please include valid email").isEmail(),
    check('password', 'Please provide a password with six or more characters')
    .isLength({min:6})
], (req,res)=>{
    /*
    * if we have errors from any one of the check methods, it can
    * be retrived using validationResult(req)
    * https://express-validator.github.io/docs/validation-result-api.html
    */
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }
    res.send('User route');
});

module.exports = router;