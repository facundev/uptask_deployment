const express = require('express');
const routes = require('./routes');
const path = require('path');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session  = require('express-session');
const cookieParser  = require('cookie-parser');
const passport  = require('./config/passport');

require('dotenv').config({ path: 'variables.env' });

const helpers = require('./helpers');

const db = require('./config/db');

require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al Servidor'))
    .catch(error => console.log(error));
    
// Crear una app de express
const app = express();

// Directorio donde cargar los archivos estaticos
app.use(express.static('public'));

// Habilitar Pug
app.set('view engine', 'pug');

// Permite leer los datos del formulario
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Agregamos ExpressValidator a toda la aplicacion
app.use(expressValidator());

// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// Agregar flash messages a toda la aplicacion
app.use(flash());

app.use(cookieParser());

// Sessions nos permite navegar entre distintas paginas sin volver a autenticarnos
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false,
}));

// Inicializa una instacia de passport
app.use(passport.initialize());
app.use(passport.session());

// Permite usar var_dump en toda la aplicacion
app.use((request, response, next) => {
    response.locals.vardump = helpers.vardump;
    response.locals.mensajes =  request.flash();
    response.locals.usuario = {...request.user } || null;
    next(); 
});

// Agregar routes a toda la aplicacion
app.use('/', routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor está funcionando');
});

//require('./handlers/email');