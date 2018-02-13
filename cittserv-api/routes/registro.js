//este archivo habilita las respuestas en la API
var express = require('express');
var app = express();////extra
var router = express.Router();
var mongoose = require('mongoose');
var ejs = require('ejs');
var fs = require('fs');
var Registro = require('../models/Registro.js');
var User = require('../models/User.js');
var Campo = require('../models/Campos.js');

// app.use("/styles",express.static(__dirname + "/styles"));/////extra
app.use(express.static('/home/jca/Development/JS/appSCM/api-scm/routes/templates'));

const sendEmail = require('./transport.js');

// var cabeceras = ["PROGRAMA","RESPONSABLE","PLATAFORMA","RESPONSABLE"];
// var cabecerasMin = ["programa","responsable","plataforma","descripcion"];
var templateString = fs.readFileSync('/home/jca/Development/JS/appSCM/api-scm/routes/templates/correo.ejs', 'utf-8');

router.get('/sendMail/:correo/:listado/:remitente', function(req, res, next) {
  var listaEventos = [];
  console.log('listadoassa: ' + req.params.listado);

  var Sequence = exports.Sequence || require('sequence').Sequence
    , sequence = Sequence.create()
    , err
    ;
  var array = req.params.listado.split(',');
  sequence
  .then(function (next) {
    setTimeout(function () {
    for (var i = 0, len = array.length; i < len; i++) {
      Registro.findById(array[i], function (err, post) {
        console.log('********************cdscenviandoCorreo: ' + JSON.stringify(post) + post.responsable);
        listaEventos.push(post);
      });
    }
    next(err, listaEventos);
  }, 500);
  })
  .then(function (next, err, listaEventos) {
    setTimeout(function () {
    console.log('************Obj: ' + JSON.stringify(listaEventos[0]));
    fecha = new Date().toISOString().
                        replace(/T/, ' ').
                        replace(/\..+/, '');
    message = ejs.render(templateString, {result: listaEventos, fecha: fecha, remitente: req.params.remitente});
    // message = ejs.render(templateString, {result: drinks});
    sendEmail(req.params.correo, 'Notificacion eventos', message);
    next();
  }, 500);
  });
  res.json({envio: 'ok'});
});

router.get('/queryTimesbyparameters/:key/:value/:fechaIni/:fechaFin', function(req, res, next) {

  console.log('********************key: ' + req.params.key);
  console.log('********************value: ' + req.params.value);
  console.log('********************fechaIni: ' + req.params.fechaIni);
  console.log('********************fechaFin: ' + req.params.fechaFin);
  key = req.params.key;
  value = req.params.value;
  Registro.count({[key]: value, fechaevento: {$gte: req.params.fechaIni, $lt: req.params.fechaFin}},function (err, registro) {
          if (err) return next(err);
          res.json({value: registro});
        });
});
router.get('/queryDobleParametro/:key1/:value1/:key2/:value2/:fechaIni/:fechaFin', function(req, res, next) {
  console.log('********************key: ' + req.params.key1);
  console.log('********************value: ' + req.params.value1);
  console.log('********************fechaIni: ' + req.params.fechaIni);
  key1 = req.params.key1;
  value1 = req.params.value1;
  key2 = req.params.key2;
  value2 = req.params.value2;
  Registro.count({[key1]: value1, [key2]: value2, fechaevento: {$gte: req.params.fechaIni, $lt: req.params.fechaFin}},function (err, registro) {
          if (err) return next(err);
          //DEVUELVE UN AREGLO DE DOCUMENTOS
          console.log(key1,value1,key2,value2);
          console.log('************value: ' + registro);//OK
          res.json({value: registro, key: value2});
        });
});
router.get('/', function(req, res, next) {
  Registro.find(function (err, registro) {
    if (err) return next(err);
    res.json(registro);
  });
});
//todos
router.get('/Users', function(req, res, next) {
  User.find(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});
//Uno
router.get('/Users/:id', function(req, res, next) {
  User.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });});
router.get('/Users/username/:username', function(req, res, next) {
  // db.users.findOne({username:"ssss"})
  User.findOne({username:req.params.username}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });});
router.post('/Users/username/:username', function(req, res, next) {
  // db.users.findOne({username:"ssss"})
  User.remove({username:req.params.username}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });});
router.post('/Users', function(req, res, next) {
  console.log('post');
  User.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
///////Campos
router.get('/Campos/:key', function(req, res, next) {
  Campo.find({key:req.params.key},function (err, campos) {
    if (err) return next(err);
    res.json(campos);
  });
});
router.post('/Campos/update', function(req, res, next) {
  console.log('post');
  Campo.insertMany(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
router.post('/Campos', function(req, res, next) {
  console.log('post');
  Campo.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
router.post('/Campos/remove/:key', function(req, res, next) {
  Campo.remove({key:req.params.key},function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
//remove({"key":"operador"})
/////////////
/* POST /todos */
router.post('/', function(req, res, next) {
  console.log('post');
  Registro.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /bitacora/id */
router.get('/:id', function(req, res, next) {
  Registro.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  Registro.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/informado/:id', function(req, res, next) {
  Registro.findByIdAndUpdate(req.params.id, {$set: {informado : true}}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Registro.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

// Carga una vista HTML simple donde irá nuestra Single App Page
// Angular Manejará el Frontend
router.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});

module.exports = router;
