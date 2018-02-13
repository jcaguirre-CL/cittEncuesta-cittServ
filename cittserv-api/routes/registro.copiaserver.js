var express = require('express');
var app = express();////extra
var router = express.Router();
var mongoose = require('mongoose');
var ejs = require('ejs');
var fs = require('fs');
var Registro = require('../models/Registro.js');
var User = require('../models/User.js');
var Campo = require('../models/Campos.js');
app.use(express.static('/mnt/Development/appMCR/api-mcr/routes/templates'));
const sendEmail = require('./transport.min.js');
var templateString = fs.readFileSync('/mnt/Development/appMCR/api-mcr/routes/templates/correo.ejs', 'utf-8');
router.get('/sendMail/:correo/:listado/:remitente', function(req, res, next) {
  var listaEventos = [];
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
        listaEventos.push(post);
      });
    }
    next(err, listaEventos);
  }, 500);
  })
  .then(function (next, err, listaEventos) {
    setTimeout(function () {
    fecha = new Date().toISOString().
                        replace(/T/, ' ').
                        replace(/\..+/, '');
    message = ejs.render(templateString, {result: listaEventos, fecha: fecha, remitente: req.params.remitente});
    sendEmail(req.params.correo, 'Notificacion eventos', message);
    next();
  }, 500);
  });
  res.json({envio: 'ok'});
});
router.get('/queryTimesbyparameters/:key/:value/:fechaIni/:fechaFin', function(req, res, next) {
  key = req.params.key;
  value = req.params.value;
  Registro.count({[key]: value, fechaevento: {$gte: req.params.fechaIni, $lt: req.params.fechaFin}},function (err, registro) {
          if (err) return next(err);
          res.json({value: registro});
        });
});
router.get('/queryDobleParametro/:key1/:value1/:key2/:value2/:fechaIni/:fechaFin', function(req, res, next) {
  key1 = req.params.key1;
  value1 = req.params.value1;
  key2 = req.params.key2;
  value2 = req.params.value2;
  Registro.count({[key1]: value1, [key2]: value2, fechaevento: {$gte: req.params.fechaIni, $lt: req.params.fechaFin}},function (err, registro) {
          if (err) return next(err);
          res.json({value: registro, key: value2});
        });
});
router.get('/', function(req, res, next) {
  Registro.find(function (err, registro) {
    if (err) return next(err);
    res.json(registro);
  });
});
router.get('/Users', function(req, res, next) {
  User.find(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});
router.get('/Users/:id', function(req, res, next) {
  User.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });});
router.get('/Users/username/:username', function(req, res, next) {
  User.findOne({username:req.params.username}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });});
router.post('/Users/username/:username', function(req, res, next) {
  User.remove({username:req.params.username}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });});
router.post('/Users', function(req, res, next) {
  User.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
router.get('/Campos/:key', function(req, res, next) {
  Campo.find({key:req.params.key},function (err, campos) {
    if (err) return next(err);
    res.json(campos);
  });
});
router.post('/Campos/update', function(req, res, next) {
  Campo.insertMany(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
router.post('/Campos', function(req, res, next) {
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
router.post('/', function(req, res, next) {
  Registro.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
router.get('/:id', function(req, res, next) {
  Registro.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });});
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
router.delete('/:id', function(req, res, next) {
  Registro.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
router.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});

module.exports = router;
