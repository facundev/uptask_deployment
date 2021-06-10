const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (request, response, next) => {
    const proyecto = await Proyectos.findOne({ where: { url: request.params.url }});

    const { tarea } = request.body;
    const estado = 0;
    const proyectoId = proyecto.id;

    const result = await Tareas.create({ tarea, estado, proyectoId });

    if (!result){
        return next();
    }

    response.redirect(`/proyectos/${request.params.url}`);
}

exports.actualizarTarea = async (request, response) => {
    const { id } = request.params;
    const tarea = await Tareas.findOne({ where: { id }});

    let estado = 0;

    if(tarea.estado === estado) {
        estado = 1;
    }

    tarea.estado = estado;
    
    const result = await tarea.save();
    
    if (!result) return next();
    
    response.status(200).send('Actualizado');
}

exports.eliminarTarea = async (request, response) => {      
    const { id } = request.params;

    const result = await Tareas.destroy({ where: { id } });

    if(!result) return next();

    response.status(200).send('Tarea eliminada.');
}