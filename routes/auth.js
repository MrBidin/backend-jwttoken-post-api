const express = require('express');
const route = express.Router();
const Auth = require('../models/Auth.js');
const { registerValidation, loginValidation} = require('./validation.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

route.post('/register', async (req, res) => {
  const { error } = registerValidation(req.body);
  if(error){
    return res.status(400).send(error.details[0].message);
  }

  const isEmailExisted = await Auth.findOne({email: req.body.email});
  if(isEmailExisted){
    return res.status(400).send('email already  existed')
  };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const authUser = new Auth({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const authUserSaved = await authUser.save();
    res.json({user: authUserSaved._id});
  } catch(error){
    res.json(error)
  }
});

route.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body);
  if(error){
    return res.status(400).send(error.details[0].message);
  }

  const user = await Auth.findOne({email: req.body.email});
  if(!user){
    return res.status(400).send('wrong email or password');
  };
  const passCheck = await bcrypt.compare(req.body.password, user.password);
  if(!passCheck){
    return res.status(400).send('wrong email or password')
  };

  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
})

module.exports = route;

