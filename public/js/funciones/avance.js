import Swal from 'sweetalert2';

export const actualizarAvance = () => {
    // Seleccioanr las tareas pendientes
    const tareas = document.querySelectorAll('li.tarea');

    if(tareas.length) {
        // Seleccioanr las tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo');
                
        // Calcular avance
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);

        // Mostrar avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance + '%';

        if(avance === 100) {
            Swal.fire('Completaste el proyecto',
            'Felicidades, has terminado tus tareas',
            'success');
        }
    }    
}