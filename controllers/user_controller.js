var users = { admin: {id:1, username:"admin", password:"1234"},
				pepe: {id:2, username:"pepe", password:"5678"}};

var LocalStrategy   = require('passport-local').Strategy;

var User = require('./../models/user.js');


exports.autenticar = function(login, password, callback){
	/*models.User.find({
		where: {
			username: login
		}
	}).then(function(user){
		if (user) {
			if(user.verifyPassword(password)){
				callback(null, user);
			}
			else{callback(new Error('password erroneo.')); }
	} else { callback(new Error('No existe user=' + login))}
	}).catch(function(error){callback(error)});
*/

if(users[login]){
	if(password === users[login].password){
		callback(null, users[login]);
		res.render('tracks/index', {tracks: tracks});
	}
	else { callback(new Error('password erroneo'));}
}	else { callback(new Error('no existe el usuario'));}
};

exports.postUsers = function(req, res) {

	console.log(req.body.name,);
	console.log(req.body.password);
  var user = new User({
    username: req.body.name,
    password: req.body.password
  });

  user.save(function(err) {
    if (err)
      res.send(err);

	//res.redirect('/tracks');
   // res.json({ message: 'New beer drinker added to the locker room!' });
  });
};




exports.new = function( req,res) {
	if ( req.session.user){
		res.render('tracks/index', {tracks: tracks});
	} else {
	res.render('sessions/signup');
	}
};

exports.create = function(req,res){

	passport.authenticate('local-signup', {
        successRedirect : '/tracks', // redirect to the secure profile section
        failureRedirect : 'sessions/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    });

	};