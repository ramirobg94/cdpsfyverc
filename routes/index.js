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

// rutas sesion
router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

// rutas users
router.get('/signup', userController.new);
router.post('/signup', userController.postUsers);
router.get('/user/:userId', userController.show);

// rutas /tracks
router.get('/tracks', trackController.list);

router.get('/tracks/new', sessionController.loginRequired, trackController.new);

router.get('/tracks/:trackId', trackController.show);

router.post('/tracks', multer({inMemory: true}), sessionController.loginRequired, trackController.create);

router.delete('/tracks/:trackId', sessionController.loginRequired, trackController.destroy);

module.exports = router;