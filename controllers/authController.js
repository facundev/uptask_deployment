const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs')
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

exports.usuarioAutenticado = (request, response, next) => {
    if(request.isAuthenticated()) {
        return next();
    } else {
        return response.redirect('/iniciar-sesion');
    }
}; 

exports.cerrarSesion = (request, response) => {
    request.session.destroy(() => {
        response.redirect('/iniciar-sesion');
    });
}; 

exports.enviarToken =  async (request, response) => {
    const { email } = request.body;
    const usuario = await Usuarios.findOne({ where: { email } });

    if (!usuario) {
        request.flash('error', 'No existe esa cuenta');
        response.redirect('/reestablecer');
    }

    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    await usuario.save();

    const resetUrl = `http://${request.headers.host}/reestablecer/${usuario.token}`;

    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password', 
    });
    request.flash('correcto', 'Se envió un mensaje a tu correo');
    response.redirect('/iniciar-sesion');
};

exports.validarToken = async (request, response) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: request.params.token
        }
    });

    if (!usuario) {
        request.flash('error', 'No valido');
        response.redirect('/reestablecer');
    }

    response.render('resetPassword', {
        nombrePagina: 'Reestablecer contraseña'
    })

    console.log(usuario);
};

exports.actualizarPassword = async (request, response) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: request.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    if (!usuario) {
        request.flash('error', 'No valido');
        response.redirect('/reestablecer');
    }

    usuario.password = bcrypt.hashSync(request.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;    

    await usuario.save();

    request.flash('correcto', 'Tu password se ha modificado correctamente')
    response.redirect('/iniciar-sesion');
};