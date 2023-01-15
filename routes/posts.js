const express = require('express');
const route = express.Router();
const verify = require('./verifyToken');

route.get('/', verify, (req, res) => {
  res.json({
    posts: {
      title: "my first post",
      description: "random data you shouldnt access"
    }
  })
});

module.exports = route;