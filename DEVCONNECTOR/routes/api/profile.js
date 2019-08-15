const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/Users");
/*
 * @route GET api/profile/me
 * @description: Get current user profile
 * @access Private
 */
router.get("/me", auth, async (req, res) => {
    try {
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
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            "user",
            ["name", "avatar"]
        );

        if (!profile) {
            return res.status(400).json({ msg: "There is no profile for this user" });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

/*
 * @route POST api/profile
 * @description: Create or Update an User Profile
 * @access Private
 */

/*
 * When we use multiple middleware, we put them in an array
 * Here it will first check if the user is authorized/logged in using the
 * passed x-auth-token that we get when logging in. Auth.js file does that
 * checking.
 * Then we check if the user actually provided the status and skills
 */
router.post(
    "/",
    [
        auth,
        [
            check("status", "Status is required")
                .not()
                .isEmpty(),
            check("skills", "Skills is required")
                .not()
                .isEmpty()
        ]
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
                          const errors = validationResult(
                            req
                          );
                          if (!errors.isEmpty()) {
                            return res
                              .status(400)
                              .json({
                                errors: errors.array()
                              });
                          }
                          // array destructuring to grab all required data from the request body
                          const {
                            company,
                            website,
                            location,
                            bio,
                            status,
                            githubusername,
                            skills,
                            youtube,
                            facebook,
                            twitter,
                            instagram,
                            linkedin
                          } = req.body;

                          // Build profile object

                          /*
                           * this means if the field exits, add that field, for example
                           * if the company field exists, add the company filed
                           * Since this {} means an object, at the end of the day profileFields object will look like
                           * this
                           * profileFields{
                           *   company:something,
                           *   website: something,
                           *   location: something}
                           * And so on
                           */
                          const profileFields = {};
                          profileFields.user =
                            req.user.id;
                          if (company)
                            profileFields.company = company;
                          if (website)
                            profileFields.website = website;
                          if (location)
                            profileFields.location = location;
                          if (bio)
                            profileFields.bio = bio;
                          if (status)
                            profileFields.status = status;
                          if (githubusername)
                            profileFields.githubusername = githubusername;

                          /*
                           * So the skills will be comma separated values, and we
                           * want to have an array for it. Split breaks a string to array
                           * Here we wanna split at every comma and take that value to an
                           * array element
                           * https://www.tutorialrepublic.com/faq/how-to-convert-comma-separated-string-into-an-array-in-javascript.php
                           * 
                           * Now we don't want whitespaces, we use trim for it
                           * https://www.w3schools.com/jsref/jsref_trim_string.asp
                           * So trim gets rid of whitespaces
                           * Now lets say we had something like anna,shafi,     evana,jason,    someoneelse
                           * Now all of them will be an array element, but then evana and someoneelse will have unnecessary whitespaces
                           * So in array it will look like [anna,shafi,    evana,jason,   someoneelse] 
                           * We don't want the whitespace. So we run a loop for each element using map, and then for each
                           * element we use trim method to get rid of the whitespaces
                           */
                          if (skills) {
                            profileFields.skills = skills
                              .split(",")
                              .map(skill =>
                                skill.trim()
                              );
                          }

                          // Build social object
                          profileFields.social = {};
                          if (youtube)
                            profileFields.social.youtube = youtube;
                          if (twitter)
                            profileFields.social.twitter = twitter;
                          if (facebook)
                            profileFields.social.facebook = facebook;
                          if (linkedin)
                            profileFields.social.linkedin = linkedin;
                          if (instagram)
                            profileFields.social.instagram = instagram;

                          try {
                            let profile =await Profile.findOne({user: req.user.id });
                            if(profile){
                              // update existing profile if profile exists
                              /*
                              * https://mongoosejs.com/docs/tutorials/findoneandupdate.html
                              */
                              profile = await Profile.findOneAndUpdate({ user: req.user.id},{$set: profileFields}, {new: true});
                              return res.json(profile);
                            }
                            // if profile doesn't exist, create new one
                            profile = new Profile(profileFields);
                            await Profile.save();
                            return res.json(profile);
                          } catch (error) {
                            console.error(error.message);
                            res.status(500).send("Server Error");
                          }
                        }
                        //hrllo
);

module.exports = router;
