

exports.loginRequired = function(req, res, next){
	if ( req.session.user){
		next();
	} else {
		res.redirect("/login");
	}
};

exports.new = function( req,res) {
	console.log(req.session.errors);
	var errors = req.session.errors || {};
	req.session.errors = {};
console.log(errors);
	res.render('sessions/new', {errors: errors});


};

exports.create = function(req,res){
	var login	 = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');

	userController.autenticar(login, password, function(error, user) {

		if(error) { //si hay error retornamos mensajes de error de sesion
			console.log(typeOf(error));
			console.log(error[0]);
			req.session.errors = {};
			//req.session.errors ={error: error[0].Error};

			res.redirect("/login");
			return;
		}
console.log(user);
		//Crear req.session.user y guardar campos id y username
		// La sesion se define por la existencia de: req.session.user
console.log(user._id);
		req.session.user = {id:user._id, username:user.username};

		res.redirect(req.session.redir.toString()); //redireccion a path anterior o login
	});
};

//DELETE /logout --DEstruir sesion
exports.destroy = function(req, res){
	delete req.session.user;
	res.redirect(req.session.redir.toString()); //redirect a path anterior a login
};