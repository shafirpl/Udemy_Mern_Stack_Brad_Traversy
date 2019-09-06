const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const config = require("config");

const User = require("../../models/Users");
const Post = require("../../models/Posts");
const Profile = require("../../models/Profile");

/*
* @route POST api/posts
* @description: Create a post
* @access Private
*/
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        try {
            const user = await User.findById(req.user.id).select(
                "-password"
            );

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });

            const post = await newPost.save();
            res.json(post);

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }

    });

/*
* @route GET api/posts
* @description: Get All Posts
* @access Private
*/
router.get('/', auth, async (req, res) => {
    try {
        /*
        * this date:-1 will sort stuff based on recent dates. So posts with latest dates will be
        * top
        */
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
})

/*
* @route GET api/posts/:id
* @description: Get Post By Id
* @access Private
*/
router.get('/:id', auth, async (req, res) => {
    try {
        /*
        * this date:-1 will sort stuff based on recent dates. So posts with latest dates will be
        * top
        */
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error(error.message);
        /*
        * https://www.udemy.com/mern-stack-front-to-back/learn/lecture/10055222?start=30#questions
        * Starts from 5:04
        * The reason we do this, we want to get 500 status if and only if there is a server error,
        * nothing else. So invalid object id would directly come here and show us the error, but 
        * that error is because of the invalid object id, not because there was actually something wrong
        * with ther server. That is why we run this check to make sure we only get server error if and only 
        * if it is an actual server error.
        */
        if (error.kind == "ObjectId") {
            return res.status(404).json({ msg: "Post not found" });
        }
        res.status(500).send("Server Error");
    }
})

/*
* @route DELETE api/posts/:id
* @description: Delete a post
* @access Private
*/
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }
        // check to see if the user actually owns the post
        /*
        * post.user is an object, so in order to be compatible, we 
        * have to convert it to a string
        */
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await post.remove();
        res.json({ msg: 'Post removed' });
    } catch (error) {
        console.error(error.message);
        if (error.kind == "ObjectId") {
            return res.status(404).json({ msg: "Post not found" });
        }
        res.status(500).send("Server Error");
    }
})

/*
* @route PUT api/posts/like/:id
* @description: Like a post
* @access Private
*/

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // check if the post has already been liked
        // explanation in google docs in post.likes explanation section of explanation section

        //This using {} could be written as: notice the return statement
        // if(post.likes.filter( like => { return like.user.toString() === req.user.id}).length>0){
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' });
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        if (error.kind == "ObjectId") {
            return res.status(404).json({ msg: "Post not found" });
        }
        res.status(500).send("Server Error");
    }
})

/*
* @route PUT api/posts/unlike/:id
* @description: Unlike a post
* @access Private
*/

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // check if the post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not yet been liked' });
        }

        // Remove user from liked array
        post.likes = post.likes.filter(
            item => item.user.toString() !== req.user.id
        );

        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        if (error.kind == "ObjectId") {
            return res.status(404).json({ msg: "Post not found" });
        }
        res.status(500).send("Server Error");
    }
})

/*
* @route POST api/posts/comment/:id
* @description: Comment on a post
* @access Private
*/
router.post(
    "/comment/:id",
    [
        auth,
        [
            check("text", "Text is required")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        try {
            const user = await User.findById(req.user.id).select("-password");

            const post = await Post.findById(req.params.id);

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            post.comments.unshift(newComment);
            await post.save();

            return res.json(post.comments);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

/*
* @route DELETE api/posts/comment/:id/:comment_id
* @description: Delete a comment
* @access Private
*/
router.delete(
    "/comment/:id/:comment_id", auth,
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);

            // pull out comment from the post
            const comment = post.comments.find( comment => comment.id === req.params.comment_id);

            // Make sure comment exists
            if(!comment) {
                return res.status(404).json({ msg: 'Comment does not exist'});
            }

            //check to see if the logged in user actually made the comment, because
            // only user who actually made the comment should be allowed to delete it
            // some other user shouldn't be allowed to delete it

            // the user is type of object id, so we need to turn it into string, the same thing
            // happened earlier
            if(comment.user.toString() !== req.user.id){
                return res.status(401).json({ msg: "Unauthorized User" });
            }

            post.comments = post.comments.filter(item => item.id !== comment.id);
            await post.save();

            return res.json(post.comments);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

module.exports = router;