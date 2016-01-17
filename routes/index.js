var express = require('express');
var router = express.Router();
var multer  = require('multer');
var passport = require('passport');

var tracks_dir = process.env.TRACKS_DIR || './media/';

var trackController = require('../controllers/track_controller');
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');

router.get('/', function(req, res) {
  res.render('index');
});

//Mndb Guardar usuarios iniciales
router.get('/cargar', trackController.cargar);
//aqui acaba

// rutas sesion
router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);

require('../config/passport')(passport);

router.get('/signup', userController.new);
router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

// rutas /tracks
router.get('/tracks', trackController.list);

router.get('/tracks/new', sessionController.loginRequired, trackController.new);

router.get('/tracks/:trackId', trackController.show);

router.post('/tracks', multer({inMemory: true}), sessionController.loginRequired, trackController.create);

router.delete('/tracks/:trackId', sessionController.loginRequired, trackController.destroy);

module.exports = router;