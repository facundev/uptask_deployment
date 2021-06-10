const Usuarios = require('../models/Usuarios')
const enviarEmail = require('../handlers/email')

exports.formCrearCuenta = (request, response) => {
    response.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en UpTask'
    })
}, 

exports.formIniciarSesion = (request, response) => {
    const { error } = response.locals.mensajes;

    response.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesión en UpTask',
        error
    })
}, 

exports.crearCuenta = async (request, response) => {
    const { email, password } = request.body;

    try {
        await Usuarios.create({
            email,
            password
        });

        // Crear URL de confirmar
        const confirmarUrl = `http://${request.headers.host}/confirmar/${email}`;

        // Crear objeto Usuario
        const usuario = {
            email,
        }

        // Enviar Email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta', 
        });

        // Redirigir al usurio
        request.flash('correcto', 'Enviamos un correo, confirma tu cuenta');

        response.redirect('/iniciar-sesion')
    } catch (error) {
        request.flash('error', error.errors.map(error => error.message));
        response.render('crearCuenta', {
            mensajes: request.flash(),
            nombrePagina: 'Crear Cuenta en UpTask',
            email,
            password
        });
    }
}

exports.formReestablecerPassword = (request, response) => {
    response.render('reestablecer'), {
        nombrePagina: 'Reestablecer tu contraseña'
    }
};

exports.confirmarCuenta = async (request, response) => {
    const usuario = await Usuarios.findOne({ where: { email: request.params.correo }});

    if (!usuario) {
        request.flash('error', 'No valido');
        response.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    request.flash('correcto', 'Cuenta activada correctamente');
    response.redirect('/iniciar-sesion')
};
