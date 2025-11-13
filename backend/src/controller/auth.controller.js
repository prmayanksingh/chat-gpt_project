const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function registerController(req, res) {
  const {
    fullname: { firstname, lastname },
    email,
    password,
  } = req.body

  const userExists = await userModel.findOne({email})

  if(userExists){
    return res.status(400).json({
      message:"Unautharized - user already exists"
    })
  }

  
  const hashPassword = await bcrypt.hash(password,10);

  
  const user = await userModel.create({
    fullname:{
      firstname,
      lastname
    },
    email,
    password:hashPassword
  })
  
  const token = await jwt.sign({id:user._id}, process.env.JWT_SECRET)

  res.cookie("token", token)

  res.status(201).json({
    message:"user registered successfully!",
    user:{
      fullname:user.fullname,
      email:user.email,
      password:user.password,
    }
  })
}

async function loginController(req,res){
  const {email,password} = req.body;

  const user = await userModel.findOne({email})

  if(!user){
    return res.status(400).json({
      message:"Invalid email or password"
    })
  }

  const passValid = bcrypt.compare(password, user.password)
  
  if(!passValid){
    return res.status(400).json({
      message:"Invalid email or password"
    })
  }

  const token = await jwt.sign({id:user._id}, process.env.JWT_SECRET);

  res.cookie("token",token);

  res.status(200).json({
    message:"loggedIn successfully!",
    user
  })
}

module.exports = {
  registerController,
  loginController
};
