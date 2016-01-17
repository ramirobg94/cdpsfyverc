var users = { admin: {id:1, username:"admin", password:"1234"},
				pepe: {id:2, username:"pepe", password:"5678"}};

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

exports.new = function( req,res) {
	if ( req.session.user){
		next();
	} else {
	res.render('sessions/signup');
	}
};

exports.create = function(req,res){
	};