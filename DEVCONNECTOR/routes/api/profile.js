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
 * https://www.udemy.com/mern-stack-front-to-back/learn/lecture/10055200?start=585#questions
 * Watch from 15:32
 * This summarizes what we are doing here
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
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
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

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
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // update existing profile if profile exists
        /*
         * https://mongoosejs.com/docs/tutorials/findoneandupdate.html
         */
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      // if profile doesn't exist, create new one
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
  //hrllo
);

/*
 * @route GET api/profile
 * @description: GET Profile by user id
 * @access Public
 */

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

/*
 * @route GET api/profile/user/:user_id
 * @description: GET All Profiles
 * @access Public
 */

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    /*
     * https://www.udemy.com/mern-stack-front-to-back/learn/lecture/10055206?start=60#overview
     * From 9:24
     */
    if (error.kind == "ObjectId") {
      return res.status(400).json({
        msg: "Profile not found"
      });
    }
    res.status(500).send("Server Error");
  }
});

/*
 * @route DELETE api/profile/user/:user_id
 * @description: Delete profile, user and posts
 * @access Private
 */

router.delete("/", auth, async (req, res) => {
  try {
    /*
     * Remember when we are coming out of the auth middleware, our request object will contain
     * the user object info. That is why we don't need req.params,
     * Check line 32 in auth.js file,  req.user = decoded.user;
     */
    // @todo - remove user posts
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove User
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User Deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

/*
 * @route PUT api/profile/experience
 * @description: ADD Profile experience
 * @access Private
 */
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      // https://www.w3schools.com/jsref/jsref_unshift.asp
      /*
       * The reason we are using unshift, we want the most recent experiences
       * at first/begining of the array, which makes sense as in the resume we
       * list recent experiences at the top/begining
       */
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

/*
 * @route DELETE api/profile/experience/:exp_id
 * @description: Delete experience from profile
 * @access Private
 */

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //get remove index
    /*
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
     * https://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array
     * So in order for index of to work, we need exact match.
     * For example, in the mozilla document, since the array only contains string, bison matches with
     * bison without issue. However, in object array, we don't have that luxury. So we need to run a loop, and 
     * then retun the thing/property of that object in the array
     * that can be matched exactly with the option in the indexOf stuff. So here 
     * we want id to be matching, that is why we are doing map function and returning the id. 
     * 
     * In the stack overflow, that stevie has to be matched with stevie, which comes from hello property. 
     * That is why we have to map to get the hello property and then on top of it use the indexOf method.
     */
    // const removeIndex = profile.experience
    //   .map(item => item.id)
    //   .indexOf(req.params.exp_id);
    // profile.experience.splice(removeIndex, 1);

    //my way
    profile.experience = profile.experience.filter(
      item => item.id !== req.params.exp_id
    );
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
