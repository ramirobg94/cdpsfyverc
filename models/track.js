//Modelo de datos de canciones (track)


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./../models/user.js');

//create a schema

var trackSchema = new Schema({
  name: { type: String, required: true },
  nameFile: { type: String, required: true },
  url: { type: String, required: true },
  urlCover: String,
  created_at: Date,
  updated_at: Date
  _uploadBy: { type: Schema.Types.ObjectId, ref: 'User' },
});



trackSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});




// the schema is useless so far
// we need to create a model using it
var Track = mongoose.model('Track', trackSchema);

// make this available to our users in our Node applications
module.exports = Track;