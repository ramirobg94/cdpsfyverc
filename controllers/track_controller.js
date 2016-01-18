var fs = require('fs');
var FormData = require('form-data');
var http = require('http');
var request = require('request');
//mndb des comentar si no
//var track_model = require('./../models/track');
var Track = require('./../models/track.js');

exports.cargar = function (req, res) {
	var track = new Track({
		name: 'Cute',
		nameFile: 'Cute.mp3',
		url: '/media/Cute.mp3'
	});

	track.save(function(err) {
		if (err) throw err;

		console.log("guardado con exito");
	})
}
// Devuelve una lista de las canciones disponibles y sus metadatos
exports.list = function (req, res) {
console.log(req.session.user._id);s
	Track.find({},function(err,tracks){
		if (err) throw err;
		//var tracks = track_model.tracks;
		//console.log(tracks);
		res.render('tracks/index', {tracks: tracks});
	});
};

// Devuelve la vista del formulario para subir una nueva canción
exports.new = function (req, res) {
	res.render('tracks/new');
};

// Devuelve la vista de reproducción de una canción.
// El campo track.url contiene la url donde se encuentra el fichero de audio
exports.show = function (req, res) {
	Track.findById(req.params.trackId,function(err,track){
	//var track = track_model.tracks[req.params.trackId];
	//track.id = req.params.trackId;
	res.render('tracks/show', {track: track});
	});

};

// Escribe una nueva canción en el registro de canciones.
// TODO:
// - Escribir en tracks.cdpsfy.es el fichero de audio contenido en req.files.track.buffer
// - Escribir en el registro la verdadera url generada al añadir el fichero en el servidor tracks.cdpsfy.es
exports.create = function (req, res) {
	console.log(req.files);
	var timestamp = new Date().getTime().toString();


	var track = req.files.track;

	if(req.files.coverPhoto == null){
		console.log("no hay cover");
		//var urlCover = 'http://localhost:3000/public/covers/noName';
		///images/quaver3.png
		var urlCover = '/images/quaver3.png';
	}else{
		console.log("si hay cover");
		var coverPhoto = req.files.coverPhoto;

		var urlC = 'http://10.1.1.1/api/photoCover';
		var reqCover = request.post(urlC,function(err,resp,body){
			if(err){
				console.log('Error!');
			}else{
				console.log('URL2:' + body)
			}
		});
		var formCover = reqCover.form();
		var nameCover = timestamp + '.png';
		formCover.append('coverPhoto',coverPhoto.buffer,{filename: nameCover, contentType:'image/png'});
		var urlCover = 'http://10.1.1.1/media/covers/'+nameCover;
	}

	console.log('Nuevo fichero de audio. Datos: ', track);
	var id = track.name.split('.')[0];
	var name = track.originalname.split('.')[0];

	// Aquí debe implementarse la escritura del fichero de audio (track.buffer) en tracks.cdpsfy.es
	// Esta url debe ser la correspondiente al nuevo fichero en tracks.cdpsfy.es
	
	/*	var form = new FormData();
	form.append('my_buffer.png', track.buffer);
	*/
	/*
	var formData = {
	  		file: track.buffer,
	  	};

		console.log(formData);

		request.post( {url:'http://localhost:3000/api/photo', formData: formData}, function(err, httpResponse, body) {
	  	if (err) {
	    return console.error('upload failed:', err);
	  	}
	  console.log('Upload successful!  Server responded with:', body);
		});
		*/
	/*
	form.submit('http://localhost:3000/api/photo', function (err,res){
		if (err) throw err;
		console.log('done');
	});*/
	console.log("hola");
	console.log(track.trackId);
	console.log("hola");
	var url = 'http://10.1.1.1/api/photo';

	var req = request.post(url,function(err,resp,body){
		if(err){
			console.log('Error!');
		}else{
			console.log('URL:' + body)
		}
	});
	

	var form = req.form();

	
	console.log(timestamp);
	//var nameRndm = timestamp + '.png'
	//form.append('userPhoto',track.buffer,{filename: nameRndm, contentType:'image/png'});
	var nameRndm = timestamp + '.mp3';
	form.append('userPhoto',track.buffer,{filename: nameRndm, contentType:'audio/mpeg'});
	var url = 'http://10.1.1.1/media/'+nameRndm;
		
		// Escribe los metadatos de la nueva canción en el registro.
		var track = new Track({
			name: name,
			nameFile: nameRndm,
			urlCover: urlCover,
			url: url,
			uploadBy: req.session.user._id
	});

	track.save(function(err) {
		if (err) throw err;

		console.log("guardado con exito");
	})
		res.redirect('/tracks');
};

// Borra una canción (trackId) del registro de canciones 
// TODO:
// - Eliminar en tracks.cdpsfy.es el fichero de audio correspondiente a trackId
exports.destroy = function (req, res) {
	console.log('borrando');
	var trackId = req.params.trackId;
	
	Track.findById(req.params.trackId,function(err,track){
		var trackName = track.nameFile;
		console.log('borrado'+ trackId);
	//	if(trackId > 4){
	//		console.log("hello");
			request.del('http://10.1.1.1/delete/'+trackName);
	//	} else {
		//	console.log("id menor a 4");
		//}
		track.remove(function(err) {
		    if (err) throw err;
		    console.log('track successfully deleted!');
    		res.redirect('/tracks');
  		});
	});
};