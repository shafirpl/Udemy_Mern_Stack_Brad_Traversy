const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");


const User = require("../../models/Users");

/*
* Here i might get confused, so we have two defined routes here. Same route, but one takes get 
* request and the other takes post request. The one that takes post request is the one where
* uses logs in/provide credentials to login. That route generates token and logs the user in.
* The other route is protected route and it verifies the token using a middleware, to make sure
* unauthorized users are not able to access the route.
*/

/*
* @route GET api/auth
* @description: Test route
* @access Public
*
* This authentication is for users that already exists, here
* users are trying to log in
*
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

/*
 * @route POST api/auth
 * @description: Authenticate user & get token
 * @access Public
 *
 * Here we are running express validator as middleware in the []
 * section
 * What we are doing here is checking/validating email, password
 * and name, and then creating the user
 */
router.post(
    "/",
    [

        check("email", "Please include valid email").isEmail(),
        /*
        * We are making sure that the password is not empty here
        */
        check(
            "password",
            "Password is required"
        ).exists()
    ],
    async (req, res) => {
        /*
         * if we have errors from any one of the check methods, it can
         * be retrived using validationResult(req) which returns
         * us an array
         * so if there is no error, that array should be empty
         * For more information:
         * https://express-validator.github.io/docs/validation-result-api.html
         */
        const errors = validationResult(req);
        console.log(req.body);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        /*
         * Now this is what we are planning to do
         * 1. see if the user exists with provided credentials
         * 3. Encrypt the password using bcrypt
         * 4. Return jsonwebtoken
         */

        /*
         * here we are doing array destructuring to pull out
         * necessary information
         */
        const { email, password } = req.body;

        /*
         * recall we used to do User.findOne(stuff).then(), like
         * this : https://blog.revathskumar.com/2015/07/using-promises-with-mongoosejs.html
         * However since right now we have access to async await thing from
         * es8, instead of using the promise in then function, we use that
         * that is the reason why we need to write async in front of the function
         */
        try {
            // here we are trying to see if the user exists

            //this is equivalent to this let user = await User.findOne({email: email});
            let user = await User.findOne({ email });
            // now if the user does not exists wiht provided credentials, send an error message
            if (!user) {
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            }

            // checking to make sure the provided password matches
            // the first parameter is the password the user provided by typing, and the 
            // second one is the one stored in the database for that user
            const isMatch = await bcrypt.compare(password,user.password);

            if(!isMatch){
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            }

            //generating json web token
            const payload = {
                user: {
                    id: user.id,
                }
            }
            jwt.sign(payload,
                config.get('jwtSecret'),
                { expiresIn: 3600000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token })
                });

        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }


    }
);

module.exports = router;