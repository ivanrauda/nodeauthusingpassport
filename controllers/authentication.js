const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');


function tokenForUser(user){
  const timestamp = new Date().getTime();
  return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
}


exports.signin = function(req,res,next){
  res.send({token: tokenForUser(req.user)})
}


exports.signup = function(req,res,next){
  const email = req.body.email;
  const password = req.body.password

  if(!email || !password){
    return res.status(422).send({error: 'Email or password incomplete!'});
  }

  User.findOne({email: email}, function(err, existingUser){
    if(err){
      return next("error connecting to database", err)
    }

    if(existingUser){
      return res.status(422).send({error: 'Email already taken!'})
    }

    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err){
      if(err){
        return next('could not save in db!', err)
      }

      res.json({token: tokenForUser(user)});
    });
  })
}
