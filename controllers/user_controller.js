var users = { admin: {id:1, username:"admin", password:"1234"},
				pepe: {id:2, username:"pepe", password:"5678"}};

var LocalStrategy   = require('passport-local').Strategy;

var Track = require('./../models/user.js');


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

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with name
        usernameField : 'name',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },

    function(req, name, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose name is the same as the forms name
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.name' :  name }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that name
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That name is already taken.'));
            } else {

                // if there is no user with that name
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.name    = name;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

};

exports.new = function( req,res) {
	if ( req.session.user){
		next();
	} else {
	res.render('sessions/signup');
	}
};

exports.create = function(req,res){

	passport.authenticate('local-signup', {
        successRedirect : '/tracks', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    });

	};