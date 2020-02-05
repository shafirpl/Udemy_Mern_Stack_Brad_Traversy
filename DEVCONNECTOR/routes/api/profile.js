const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");

const Profile = require("../../models/Profile");
const User = require("../../models/Users");
const Post = require("../../models/Posts");
/*
 * @route GET api/profile/me
 * @description: Get current user profile
 * @access Private
 */

router.get('/me', auth, async (req, res) => {
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
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
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
 * This is how we chain middlewares
 * The reason we put all the check stuff in another array, is for code 
 * understandibility
 * We could actually not use the second set of array for check, just could do
 * auth, check stuff1, check stuff2 etc
 * 
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
      return res.status(500).send("Server Error");
    }
  }
  
);

/*
 * @route GET api/profile
 * @description: GET Profile by user id
 * @access Public
 */

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    return res.json(profiles);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
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

    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    /*
     * https://www.udemy.com/mern-stack-front-to-back/learn/lecture/10055206?start=60#overview
     * From 9:24
     * The reason we do this, we want to get 500 status if and only if there is a server error,
     * nothing else. So invalid object id would directly come here and show us the error, but 
     * that error is because of the invalid object id, not because there was actually something wrong
     * with ther server. That is why we run this check to make sure we only get server error if and only 
     * if it is an actual server error.
     */
    if (error.kind == "ObjectId") {
      return res.status(400).json({
        msg: "Profile not found"
      });
    }
    return res.status(500).send("Server Error");
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

    // Remove User posts
    await Post.deleteMany({user: req.user.id});
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove User
    await User.findOneAndRemove({ _id: req.user.id });
    return res.json({ msg: "User Deleted" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
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
      return res.json(profile);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server Error");
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
    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

/*
 * @route PUT api/profile/education
 * @description: ADD Profile education
 * @access Private
 */

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "Degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of study is required")
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
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      // https://www.w3schools.com/jsref/jsref_unshift.asp
      /*
       * The reason we are using unshift, we want the most recent educations
       * at first/begining of the array, which makes sense as in the resume we
       * list recent experiences at the top/begining
       */
      profile.education.unshift(newEdu);
      await profile.save();
      return res.json(profile);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server Error");
    }
  }
);

/*
 * @route DELETE api/profile/education/:edu_id
 * @description: Delete education from profile
 * @access Private
 */

router.delete("/education/:edu_id", auth, async (req, res) => {
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
    profile.education = profile.education.filter(
      item => item.id !== req.params.edu_id
    );
    await profile.save();
    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

/*
 * @route GET api/profile/github/:username
 * @description: Get users repo from GitHub
 * @access Public
 */

router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      /*
       * The last part after ? is a query, it tells that take 5 per page and sorts them
       * by created in ascending order
       * So on August 28, 2019, if i send this request to my profile, Udemy_mern_Stack will come 
       * first as it was the most recent one, and only 5 most recent github repos will be shown
       *
       * So the way it works is that, we create a options object with the uri, method and 
       * headers, and then use request package to make a http request to github api, and then
       * grab the data and show it. Thats just it.
       * 
       * Documentaiton for request package: https://www.npmjs.com/package/request
       * Basically it is just like grapql/axios, it makes an http request
       */
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" }
    };

    request(options, (error, response, body)=>{
      if(error) console.error(error);

      if(response.statusCode !== 200){
        return res.status(404).json({msg: 'No GitHub Profile Found'})
      }

      return res.json(JSON.parse(body));
    } )
  } catch (error) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
