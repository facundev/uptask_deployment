const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas')

const { response, request } = require("express");
const slug = require('slug');

exports.proyectosHome = async (request, response) => {
    const usuarioId = response.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where : { usuarioId } });

    response.render('index', {
        nombrePagina: 'Proyectos ' + response.locals.year, 
        proyectos
    });
}

exports.formularioProyecto = async (request, response) => {
    const usuarioId = response.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where : { usuarioId } });
    
    response.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async(request, response) => {
    const usuarioId = response.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where : { usuarioId } });

    // Validation
    const { nombre } = request.body;
    
    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'Agrega un Nombre al Proyecto'});
    }

    if (errores.length > 0) {
        response.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        const usuarioId = response.locals.usuario.id;

        await Proyectos.create({ nombre, usuarioId });
        response.redirect('/');
    }
}

exports.proyectoPorUrl = async (request, response, next) => {
    const usuarioId = response.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where : { usuarioId } });

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: request.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])

    const tareas = await Tareas.findAll({ 
        where: {
            proyectoId: proyecto.id
        },

        //include: [
        //    { model:  Proyectos }
        //]
    });

    if(!proyecto) return next();

    response.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    });
};

exports.formularioEditar =  async (request, response) => {
    const usuarioId = response.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where : { usuarioId } });

    const proyectoPromise = Proyectos.findOne({ 
        where: {
            id: request.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);
    
    response.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async(request, response) => {
    const usuarioId = response.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where : { usuarioId } });

    // Validation
    const { nombre } = request.body;
    
    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'Agrega un Nombre al Proyecto'});
    }

    if (errores.length > 0) {
        response.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        await Proyectos.update(
            { nombre: nombre },
            {where: { id: request.params.id }}
            );
        response.redirect('/');
    }
}

exports.eliminarProyecto = async(request, response, next) => {
    const {urlProyecto} = request.query;
    const result = await Proyectos.destroy({where: { url: urlProyecto }});
    if (!result){
        return next();
    } else {
            response.status(200).send('Proytecto eliminado correctamente');
        }
}