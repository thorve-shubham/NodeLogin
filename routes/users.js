const express = require('express');
const {User,validate,validateLogin} = require('../model/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const isAuthorized = require('../middleware/auth'); 
const {sendMailToUser} = require('../model/email');


//register user and sending token with it i.e. logged in automatically
router.post('/register', async (req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email : req.body.email});
    if(user) return res.status(400).send('User with this email already there');

    const salt = await bcrypt.genSalt(10);
    const hpass = await bcrypt.hash(req.body.password,salt);

    user = new User({
        name : req.body.name,
        password : hpass,
        email : req.body.email
    });

    await user.save();

    const token = user.genAuthToken();

    const sent = sendMailToUser(user.email);
    if(!sent) return res.status(400).send('Error');

    res.header('x-auth-token',token).send('Successfully Registered...');


});


//login and adding token to header
router.post('/login', async (req,res)=>{
    const {error} = validateLogin(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email : req.body.email});
    if(!user) return res.status(400).send('Username or password invalid');


    const isValid = await bcrypt.compare(req.body.password,user.password);
    if(!isValid) return res.status(400).send('Username or password invalid');

    const token = user.genAuthToken();

    res.header('x-auth-token',token).send('Logged in Successfully');
});

router.get('/',isAuthorized , async(req,res)=>{
    
    const userDocs = await User.find().sort({name : 1});
    res.send(userDocs);
});

module.exports = router;