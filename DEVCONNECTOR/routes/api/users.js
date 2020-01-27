const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require('config');
const jwt = require('jsonwebtoken');

const User = require("../../models/Users");

/*
 * @route POST api/users
 * @description: Register user
 * @access Public
 *
 * Here all the authentication are for new user/ user who are 
 * just signing up. After sign up, we assume the user is logged in
 * as well and so we do json web token stuff so that the newly
 * created/signed up user has access to private/protected routes
 * 
 * Here we are running express validator as middleware in the []
 * section
 * What we are doing here is checking/validating email, password
 * and name, and then creating the user
 */
router.post(
  "/",
  [
    // this means if the username is empty, send a message saying
    // name is required
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include valid email").isEmail(),
    check(
      "password",
      "Please provide a password with six or more characters"
    ).isLength({ min: 6 })
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
     * 1. see if the user exists
     * 2. Get users gravatar (https://en.gravatar.com/)
     * 3. Encrypt the password using bcrypt
     * 4. Return jsonwebtoken
     * The reason we are returning web token, is we are assuming
     * that after the user created the account, s/he will be logged in
     * automatically. So we need that web token to give access to the protected routes
     */

    /*
     * here we are doing array destructuring to pull out
     * necessary information
     * Recall from node course that this is the standard way
     * of pulling out information, we used to use body parser
     * to grab data like this but now bodyparser comes included
     * with node js
     * 
     * Our goal here is that, after validation, we wanna make 
     * sure that the user doesn't exist, because if the user
     * exists, there is no point in making the same user
     */
    const { name, email, password } = req.body;

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
      // now if the user exists, then user won't be null so user won't be false,
      // recall that if a variable has any sort of value, it becomes true in any if else tests
      if (user) {
        return res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }

      /*
       * The way gravar work is that we pass in user email
       * and gravatar package finds out the user account info as
       * well as their avatar
       * we can also pass in options
       * here s: 200 means 200 px of image size
       * r: pg means pg-13 rated images, so naked or sexual
       * images will be discarded
       * and finally d:mm means if no image found, just
       * use a default/generic user icon image
       */
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      // creating a new User instance using the mongodb
      // schema
      user = new User({
          name,
          email,
          avatar,
          password
      });

      // encrypting the password

      /*
      * To use bcrypt, we first need to use hashing
      * we use genSalt function to do that, and in 
      * argument we sent how many rounds we need 
      * in documentaiton, it is recommended to send in
      * 10
      */

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password,salt);

      //saving the user to the database
      await user.save();

      /*
      * if we used then, then we have to do 
      * const salt = bcrypt.genSalt(10).then(
      *  user.password = bcrypt.hash(password, salt)).then(
      * user.save())
      */

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
                return res.json({ token })
            });

    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }


  }
);

module.exports = router;
