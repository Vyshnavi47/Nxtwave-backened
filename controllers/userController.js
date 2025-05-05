const asyncHandler=require("express-async-handler");
const dotenv = require("dotenv").config();
const User = require("../models/userModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRegister = asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    console.log(username,email,password);
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already exist");
    }
    const hashedPassword = await bcrypt.hash(password,10);
    console.log("Hashed Password:",hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    })
    console.log(`User created ${user}`);
    if(user){
        const accessToken = jwt.sign({
            user:{
                username:user.username,
                email:user.email,
                id:user.id,
            },
        },process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"1h"}
    );
    res.status(200).json({
        message:"Register successful",
        accessToken,
    user:{
        id:user._id,
        username:user.username,
        email:user.email,
    }})
        // res.status(201).json({_id : user.id, email: user.email});
    }else{
        throw new Error("User data not valid");
    }
  //  res.status(200).json({message:"Register the user"})
})
const userLogin = asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken = jwt.sign({
            user:{
                username:user.username,
                email:user.email,
                id:user.id,
            },
        },process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"1h"}
    );
    res.status(200).json({
        message:"Login successful",
        accessToken,
    user:{
        id:user._id,
        username:user.username,
        email:user.email,
    }})
    }else{
        res.status(401);
        throw new Error("email or password not valid");
    }
})

module.exports = {userRegister,userLogin}