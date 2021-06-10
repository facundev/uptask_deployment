const passport  = require('passport');
const localStrategy  = require('passport-local').Strategy;

// Modelos a autenticar
const Usuarios = require('../models/Usuarios');

passport.use(
    new localStrategy(
        {
        usernameField: 'email',
        passwordField: 'password',
    },
    async (email, password, done) => {
        try {
            const usuario = await Usuarios.findOne({
                where: {
                    email,
                    activo: 1,
                }
            });

            if (!usuario.verificarPassword(password)) {
                return done(null, false,{
                    message: 'Password incorrecto'
                })
            } else {
                return done(null, usuario);
            }
        } catch (e) {
            return done(null, false, {
                message: 'Esa cuenta no existe'
            })
        }
    }
    )
);

// Serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario)
});

// Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario)
});

module.exports = passport;