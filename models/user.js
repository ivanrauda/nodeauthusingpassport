const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');


const userSchema = new mongoose.Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String
});


//on save hook, encrypt password



//run the pre function before you save the model
userSchema.pre('save', function(next){
  //get access to user model
  const user = this;

  //generates a salt and runs a function when salt is done
  bcrypt.genSalt(10, function(err,salt){
    if(err){
      return next(err);
    }

    //hash the user password with the salt
  bcrypt.hash(user.password, salt, null, function(err, hash){
    if(err){
      return next(err)
    }
    //overwrite the password with the hash
    user.password = hash;
    //next() === save password
    next();
  })
  })
})


userSchema.methods.comparePassword = function(candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err){return callback(err);}

    callback(null, isMatch)
  })
}




const ModelClass = mongoose.model('user', userSchema);


module.exports = ModelClass;
