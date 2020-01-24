const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//Creating a local strategy
const localOptions = {
  usernameField: 'email'
}

const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  User.findOne({email: email}, function(err,user){
    if(err){return done(err); }

    if(!user){return done(null,false); }

    user.comparePassword(password, function(err,isMatch){
      if(err){ return done(err); }

      if(!isMatch){ return done(null, false); }

      return done(null, user);

    })

  })
})





//options for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

//Creating JWT strategy
//payload parameter is what gets returned from tokenForUser function
const jwtlogin = new JwtStrategy(jwtOptions, function(payload,done){
  User.findById(payload.sub, function(err,user){
    if(err) {
      return done(err, false);
    }

    if(user) {
       done(null, user);
    } else {
       done(null, false);
    }

  })
})

//tell passport to use this stategy
passport.use(jwtlogin);
passport.use(localLogin)
