/*
Archivo principal que contiene la configuración del servidor,
se importan los modulos nescesarios para que funcione la aplicacion.
*/

// Importando modulos importantes
const express = require('express');
const app = express();
const morgan =require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

// Importando la url de la DB
const {url}  = require('./config/database');

// Conexion a la DB
mongoose.connect(url);
require('./config/passport')(passport);

//Configuración del servidor
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares para la ejecución de complementos
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
  secret: 'S3cur1ty2018byj0n4th4ns1m4nc4',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//importando archivo de rutas
require('./app/routes')(app, passport);

//estableciendo carpeta de archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

//Consola del servidor
app.listen(app.get('port'), () => {
  console.log('Server on port ', app.get('port'));
})
