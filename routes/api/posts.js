const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');

const User = require('../../models/User');
const Post = require('../../models/Post');



// @route       POST api/posts
// @desc        Create a post
// @access      Private
router.post(
    '/',
    [auth, [
        check('text', 'Text is required').not().isEmpty()
        ] 
    ],
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }


        try {
            const user = await User.findById(req.user.id).select('-password');

            const newPost = {
                text : req.body.text,
                name : user.name,
                avatar : user.avatar,
                user : req.user.id
            };

            const post = new Post(newPost);
            await post.save();
            res.json(post);
        } 
        catch (err) {
            console.error(err.message);
            res.status(400).json('ServerError');
        }

        
    });






// @route       GET api/posts
// @desc        Get all posts
// @access      Private
router.get(
    '/',
    auth,
    async (req,res) => {
        try {
            const posts = await Post.find().sort({date : -1});
            res.json(posts);
        } 
        catch (err) {
            console.error(err.message);
            res.status(400).json('ServerError');
        }
    }
)



// @route       GET api/posts/:id
// @desc        Get all posts by id
// @access      Private
router.get(
    '/:id',
    auth,
    async (req,res) => {
        try {
            const posts = await Post.findById(req.params.id).sort({date : -1});
            if(!posts){
                return res.status(404).json({msg : 'Post not found'});
            }
            res.json(posts);
        } 
        catch (err) {
            console.error(err.message);
            if(err.kind == 'ObjectId'){
                return res.status(404).json({msg : 'Post not found'});
            }
            res.status(400).json('ServerError');
        }
    }
)




// @route       Delete api/posts/:id
// @desc        delete all posts
// @access      Private
router.delete(
    '/:id',
    auth,
    async (req,res) => {
        try {
            const post = await Post.findById(req.params.id);
            
            // check user
            if(post.user.toString() != req.user.id){
                return res.status(401).json({msg : 'User not authorized'});
            }

            await post.remove();
            res.json({msg : 'Post removed'});
        } 
        catch (err) {
            console.error(err.message);
            if(err.kind == 'ObjectId'){
                return res.status(404).json({msg : 'Post not found'});
            }
            res.status(400).json('ServerError');
        }
    }
);





// @route       PUT api/posts/like/:id
// @desc        Like a post
// @access      Private
router.put(
    '/like/:id',
    auth,
    async (req,res) => {
        try {
            const post = await Post.findById(req.params.id);
            
            // check if post already liked by this user
            if(post.likes.filter(like => like.user.toString() == req.user.id).length > 0){
                return res.status(400).json({msg : 'Post aready liked it'});
            }

            post.likes.unshift({user: req.user.id});
            await post.save();
            res.json(post.likes);
        } 
        catch (err) {
            console.error(err.message);
            if(err.kind == 'ObjectId'){
                return res.status(404).json({msg : 'Post not found'});
            }
            res.status(400).json('ServerError');
        }
    }
);




// @route       PUT api/posts/unlike/:id
// @desc        UnLike a post
// @access      Private
router.put(
    '/unlike/:id',
    auth,
    async (req,res) => {
        try {
            const post = await Post.findById(req.params.id);
            
            // check if post already liked by this user
            if(post.likes.filter(like => like.user.toString() == req.user.id).length == 0){
                return res.status(400).json({msg : 'Post has not been liked it'});
            }


            // Get remove index
            const removeindex = post.likes.map(like=> like.user.toString()).indexOf(req.user.id);
            post.likes.splice(removeindex, 1);
            // post.likes.unshift({user: req.user.id});
            await post.save();
            res.json(post.likes);
        } 
        catch (err) {
            console.error(err.message);
            if(err.kind == 'ObjectId'){
                return res.status(404).json({msg : 'Post not found'});
            }
            res.status(400).json('ServerError');
        }
    }
);




// @route       POST api/posts/comment/:id
// @desc        Comment a post
// @access      Private
router.post(
    '/comment/:id',
    [auth, [
        check('text', 'Text is required').not().isEmpty()
        ] 
    ],
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }


        try {
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.id);

            const newComment = {
                text : req.body.text,
                name : user.name,
                avatar : user.avatar,
                user : req.user.id
            };

            post.comments.unshift(newComment);
            // const post = new Post(newPost);
            await post.save();
            res.json(post.comments);
        } 
        catch (err) {
            console.error(err.message);
            res.status(400).json('ServerError');
        }

        
    });



// @route       DElete api/posts/comment/:id/:comment_id
// @desc        Delete comment
// @access      Private
router.delete(
    '/comment/:id/:comment_id',
    auth,
    async (req,res) => {
        try {
            
            const post = await Post.findById(req.params.id);

            // Pul out comment
            const comment = post.comments.find(comment => comment.id = req.params.comment_id);
            if(!comment){
                return res.status(404).json({msg : 'Comment does not exist'});
            }

            // Check User
            if(comment.user.toString() != req.user.id){
                return res.status(401).json({msg : 'User not authorzed'});
            }

           // Get remove index
           const removeindex = post.comments
                .map(comment=> comment.user.toString())
                .indexOf(req.user.id);
           post.comments.splice(removeindex, 1);
        
           await post.save();
           res.json(post.comments);

        } 
        catch (err) {
            console.error(err.message);
            res.status(400).json('ServerError');
        }

        
    });

module.exports = router;