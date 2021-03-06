const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');



// @route       GET api/auth
// @desc        Auth route
// @access      Public

router.get('/', auth, async (req,res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
        // res.send('Auth route');
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});






// @route       POST api/auth
// @desc        Authenticate user
// @access      Public

router.post('/', 
[
    check('email', 'please include a valid email').isEmail(),
    check('password', 'please enter a password ')
        .exists()
], 
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }
    
    const {email, password} = req.body;

    try{
        // See if user exists
        let user  = await User.findOne({email });
        if(!user){
            return res.status(400).json({errors: [{msg : 'Invalid Credentials'}]});
        }

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({errors: [{msg : 'Invalid Credentials'}]});
        }

        // Return jsonwebtoken 
        const payload = {
            user : {
                id : user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            { expiresIn : 36000},
            (err,token) => {
                if(err) throw err;
                res.json({ token })
            }
        );


        console.log(req.body);

        // res.send('User registred');
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }

    
});


module.exports = router;