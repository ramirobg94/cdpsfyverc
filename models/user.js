
//Modelo de datos de canciones (track)


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var Track = require('./../models/track.js');

//create a schema

var userSchema = new Schema({
	name: String,
  	username: { type: String, required: true, unique: true },
 	password: { type: String, required: true },
 	admin: Boolean,
	urlPhoto : String,
	userCreated_at: Date,
  	userUpdated_at: Date,
  	tracks : [{ type: Schema.Types.ObjectId, ref: 'Track' }]
})

userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.userUpdated_at = currentDate;

  // if userCreated_at doesn't exist, add to that field
  if (!this.created_at)
    this.userCreated_at = currentDate;

  next();
});



// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;