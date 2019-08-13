const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");

const Profile = require("../../models/Profile");
const User = require('../../models/Users');
/*
* @route GET api/profile/me
* @description:   1 Get current user profile`112323456   
* @access Private
*/
router.get('/me', auth, async(req, res) => {
    try{
         /*
          * https://mongoosejs.com/docs/populate.html
          * So Populate is a way, after executing a query, in which our case finding the
          * user with the id, add more stuff/data to that query. So in our populate method, 
          * the first parameter tells the function from which collection/data set we will be grabbing the data, 
          * and the second option tells us what data we will be grabbing. 
          * 
          * Usually we use it on data sets which has refs to other datasets. For our case, the profile 
          * model has ref to users, so we are using that ref as first parameter
          */
         const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

         if(!profile){
             return res.status(400).json({msg: 'There is no profile for this user'});
         }
        res.json(profile);
       }
    catch(err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;