const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const router = new express.Router();

//get All users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
  });


router.post('/register',async (req,res) =>{
    //const {errors ,isValid} = validate form;

    try{
        const user = await User.find({email:req.body.email}).exec();
        if(user.length)
            return res.status(409).json({error:"Email already exists."});
        return bcrypt.hash(req.body.password,9,(error,hash) =>{
            if(error)
                return res.status(500).json({error});
            const newUser = new User({
                email: req.body.email,
                name: req.body.name,
                password: hash,
            });
            return newUser
                .save()
                .then((user) =>{
                    res.status(201).json({user});
                })
                .catch((err) =>{
                    res.status(500).json({message:err});
                });
        });
    } catch(err){
        return res.status(500).json({message:err});
    }
});

router.post('/login',async(req,res) =>{
    // valid const {errors}

    try{
        const user = await User.findOne({email:req.body.email}).exec();
        if(!user){
            return res.status(401).json({
                message:'could not find email.'
            });
        }

        return bcrypt.compare(req.body.password,user.password,(err,result) =>{
            if(err){
                return res.json(401).json({
                    message:'Auth failed.Please try again.'
                });
            }
            if(result){
                const token = jwt.sign(
                    {
                        createdAt:user.createdAt,
                        name:user.name,
                        email:user.email,
                        userId:user._id
                    },
                    process.env.REACT_APP_JWT_KEY || require('../config').jwtKey,
                    {
                        expiresIn: '1h'
                    }
                );
                return res.status(200).json({
                    message:"Auth Succesfull",
                    token
                });
            }
            return res.status(401).json({
                message:'Wrong password.Try again.'
            });
        });
    }catch(err){
        return res.status(500).json({message:err});
    }
})

router.get('/:id',async (req,res) =>{
    try{
        const user = await User.findById(req.params.id);
        if(user)
            res.json({user});
        else
            res.status(404).json({message:'User not found'});
    }catch(err){
        res.status(500).json({err});
    }
});

router.patch('/following/:id',async(req,res) =>{
    if(!req.body.idToFollow)
        return res.status(404).json({message:'No ID found'});

    try{
        await User.findByIdAndUpdate(
            req.params.id,
            {$addToSet : {following:req.body.idToFollow}},
            {new:true,upsert:true},
            (err,doc) =>{
                if(err){
                    return res.status(400).json(err);
                }
                return res.status(201).json(doc);
            }
        );
    }catch(err){
        return res.status(500).json(err);
    }
});

router.patch('/unfollowing/:id',async(req,res) =>{
    if(!req.body.idToUnfollow)
        return res.status(404).json({message:'No ID found'});

    try{
        await User.findByIdAndUpdate(
            req.params.id,
            {$pull : {following:req.body.idToUnfollow}},
            {new:true,upsert:true},
            (err,doc) =>{
                if(err){
                    return res.status(400).json(err);
                }
                return res.status(201).json(doc);
            }
        );
    }catch(err){
        return res.status(500).json(err);
    }
});

router.patch('/follower/:id',async(req,res) =>{
    if(!req.body.followerId)
        return res.status(404).json({message:'No ID found'});

    try{
        await User.findByIdAndUpdate(
            req.params.id,
            {$addToSet : {followers:req.body.followerId}},
            {new:true,upsert:true},
            (err,doc) =>{
                if(err){
                    return res.status(400).json(err);
                }
                return res.status(201).json(doc);
            }
        );
    }catch(err){
        return res.status(500).json(err);
    }
});

router.patch('/unfollower/:id',async(req,res) =>{
    if(!req.body.followerId)
        return res.status(404).json({message:'No ID found'});

    try{
        await User.findByIdAndUpdate(
            req.params.id,
            {$pull : {followers:req.body.followerId}},
            {new:true,upsert:true},
            (err,doc) =>{
                if(err){
                    return res.status(400).json(err);
                }
                return res.status(201).json(doc);
            }
        );
    }catch(err){
        return res.status(500).json(err);
    }
});


module.exports = router;