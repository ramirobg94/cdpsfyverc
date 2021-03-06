var LocalStrategy   = require('passport-local').Strategy;

var User = require('./../models/user.js');

exports.postUsers = function(req, res) {

	console.log(req.body.name);
	console.log(req.body.password);
	User.findOne({ username :  req.body.name }, function(err, user) {
        // if there are any errors, return the error
        if (err)
        	return done(err);

        // check to see if theres already a user with that name
        if (user) {
        	console.log("nombre cogido");
        	res.render('sessions/signup',{message: "name in use."} );
            //return done(null, false, req.flash('signupMessage', 'That name is already taken.'));
        } else {

        	var user = new User({
        		username: req.body.name,
        		password: req.body.password
        	});

        	user.save(function(err) {
        		if (err)
        			res.send(err);

        		res.redirect('/tracks');
			   // res.json({ message: 'New beer drinker added to the locker room!' });
			});

        }
    });
};

exports.autenticar = function(login, password, callback){
	console.log(login);
	console.log(password);
	User.findOne({username :  login},function(err,user){
		console.log("paso aqui");
		if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      /*user.validPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
    });*/

	if(password === user.password){
		console.log(user);
		return callback(null, user);
	}
	else { return callback(new Error('password erroneo'));}

});

}

exports.new = function( req,res) {
	if ( req.session.user){
		res.render('tracks/index', {tracks: tracks});
	} else {
		res.render('sessions/signup',{message: ''} );
	}
};

exports.show = function (req, res) {
	User.findById(req.params.userId,function(err,user){
	//var track = track_model.tracks[req.params.trackId];
	//track.id = req.params.trackId;
	res.render('users/show', {user: user});
});
};