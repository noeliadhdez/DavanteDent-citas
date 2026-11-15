class Cita {
    constructor(id, nombre, apellidos, telefono, dni, fechaNacimiento, fechaCita, horaCita, observaciones){
        this.id=id;
        this.nombre=nombre;
        this.apellidos=apellidos;
        this.telefono=telefono;
        this.dni=dni;
        this.fechaNacimiento=fechaNacimiento;
        this.fechaCita=fechaCita;
        this.horaCita=horaCita;
        this.observaciones=observaciones;
        
    }
}
const formulario = document.getElementById("formularioCitas");
const citas = cargarCitas();
const listaCitas = document.getElementById("listaCitas");
const mensajesError = document.getElementById("mensajesError");
let citaEditandoId = null;

function cargarCitas() {
    const cookieCitas = document.cookie.split("; ").find(function(cookie) {
        return cookie.startsWith("citas=");
    });

    if (cookieCitas === undefined) {
        return [];
    }

    const textoCodificado = cookieCitas.split("=")[1];
    const textoCitas = decodeURIComponent(textoCodificado);
    return JSON.parse(textoCitas);
}

function guardarCitas(){
    const textoCitas = JSON.stringify(citas);
    const textoCodificado = encodeURIComponent(textoCitas);
    const unAnio = 60 * 60* 24 * 365;
    document.cookie = "citas=" + textoCodificado + "; max-age=" + unAnio;
}
   function mostrarCitas() {
    listaCitas.innerHTML = "";
     if (citas.length === 0){
        const fila = document.createElement("tr");
        const celdaVacia = document.createElement("td");
        celdaVacia.textContent= "Dato vacío";
        celdaVacia.colSpan = 9;
        fila.appendChild(celdaVacia);
        listaCitas.appendChild(fila);
        return;
     }
    
    citas.sort(function(a, b) {
    const momentoA = a.fechaCita + a.horaCita;
    const momentoB = b.fechaCita + b.horaCita;
    return momentoA.localeCompare(momentoB);
    });

    citas.forEach(function(cita, indice) {
        const fila = document.createElement("tr");
        fila.dataset.id = cita.id;

        const orden = document.createElement("td");
        orden.textContent = indice + 1;

        const paciente = document.createElement("td");
        paciente.textContent = cita.nombre + " " + cita.apellidos;

        const telefono = document.createElement("td");
        telefono.textContent = cita.telefono;

        const dni = document.createElement("td");
        dni.textContent = cita.dni;

        const fechaNacimiento = document.createElement("td");
        fechaNacimiento.textContent = cita.fechaNacimiento;

        const fecha = document.createElement("td");
        fecha.textContent = cita.fechaCita;

        const hora = document.createElement("td");
        hora.textContent = cita.horaCita;
        
        const observaciones = document.createElement("td");
        observaciones.textContent = cita.observaciones;

        const acciones = document.createElement("td");
        
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.type = "button";
        botonEditar.addEventListener("click", function() {
        const idFila = Number(fila.dataset.id);

         const citasGuardadas = cargarCitas();

        const citaGuardada = citasGuardadas.find(function(c) {
        return c.id === idFila;
        });

            citaEditandoId = citaGuardada.id;

            document.getElementById("nombre").value = citaGuardada.nombre;
            document.getElementById("apellidos").value = citaGuardada.apellidos;
            document.getElementById("telefono").value = citaGuardada.telefono;
            document.getElementById("dni").value = citaGuardada.dni;
            document.getElementById("fechaNacimiento").value = citaGuardada.fechaNacimiento;
            document.getElementById("fechaCita").value = citaGuardada.fechaCita;
            document.getElementById("horaCita").value = citaGuardada.horaCita;
            document.getElementById("observaciones").value = citaGuardada.observaciones;
        });
       botonEliminar.addEventListener("click", function() {

    const indiceCita = citas.findIndex(function(citaGuardada) {
        return citaGuardada.id === cita.id;
    });

    if (indiceCita !== -1) {
        citas.splice(indiceCita, 1);
    }

    guardarCitas();

    mostrarCitas();

});

        fila.appendChild(orden);
        fila.appendChild(paciente);
        fila.appendChild(telefono);
        fila.appendChild(dni);
        fila.appendChild(fechaNacimiento);
        fila.appendChild(fecha);
        fila.appendChild(hora);
        fila.appendChild(observaciones);
        fila.appendChild(acciones);
        acciones.appendChild(botonEditar);
        acciones.appendChild(botonEliminar);

        listaCitas.appendChild(fila);
    });
}
mostrarCitas();

formulario.addEventListener("submit", function(evento){
    evento.preventDefault();
    
    let formularioValido = true;
    const errores = [];
    mensajesError.innerHTML = "";
    document.querySelectorAll(".campoError").forEach(function(campo) {
    campo.classList.remove("campoError");
    });
    

    const nombrePaciente = document.getElementById("nombre").value.trim();
    const apellidosPaciente = document.getElementById("apellidos").value.trim();
    const telefonoPaciente = document.getElementById("telefono").value.trim();
    const dniPaciente= document.getElementById("dni").value.trim();
    const fechaNacimientoPaciente = document.getElementById("fechaNacimiento").value;
    const fechaCita = document.getElementById("fechaCita").value;
    const horaCita = document.getElementById("horaCita").value;
    const observaciones= document.getElementById("observaciones").value;

    const patronNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/;
    const patronTelefono = /^[0-9]{9}$/;
    const patronDni = /^[0-9]{8}[A-Z]{1}$/;
    const hoy = new Date();
    const inicioHoy = new Date(
        hoy.getFullYear(),
        hoy.getMonth(),
        hoy.getDate()
    );
    const fechaNacimiento = new Date (fechaNacimientoPaciente + "T00:00");
    const fechaSeleccionada = new Date (fechaCita + "T00:00");
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutosActuales = ahora.getMinutes();
    const partesHoras = horaCita.split(":");
    const horaSeleccionada = Number(partesHoras[0]);
    const minutosSeleccionados = Number(partesHoras[1]);
    const mismoDia = fechaCita !== "" &&
        fechaSeleccionada.getTime() === inicioHoy.getTime();

//Validamos nombre y apellidos
if (!patronNombre.test(nombrePaciente) || !patronNombre.test(apellidosPaciente)) {
    formularioValido = false;
    errores.push("El nombre y los apellidos son obligatorios y solo pueden contener letras.");
    if (!patronNombre.test(nombrePaciente)) {
        document.getElementById("nombre").classList.add("campoError");
    }
    if (!patronNombre.test(apellidosPaciente)) {
        document.getElementById("apellidos").classList.add("campoError");
    }
} else {
    console.log(nombrePaciente);
    console.log(apellidosPaciente);
}
  //Validamos telefono
if (!patronTelefono.test(telefonoPaciente)) {
    formularioValido = false;
    errores.push("El teléfono debe contener exactamente 9 números.");
    document.getElementById("telefono").classList.add("campoError");
}else {
    console.log("Teléfono correcto");
};  
//Validamos DNI
if (!patronDni.test(dniPaciente)) {
    formularioValido = false;
    errores.push("El DNI debe contener 8 números y una letra mayúscula.");
     document.getElementById("dni").classList.add("campoError");
} else {
    console.log("DNI correcto");
}
//Validamos fecha de nacimiento
if (fechaNacimientoPaciente === "" ){
    formularioValido = false;
    errores.push("La fecha de nacimiento no puede estar vacía.");
    document.getElementById("fechaNacimiento").classList.add("campoError");
} else if (fechaNacimiento>hoy){
    formularioValido = false;
    errores.push("La fecha de nacimiento no puede ser futura.");
    document.getElementById("fechaNacimiento").classList.add("campoError");
} else {
    console.log ("La fecha de nacimiento es correcta");
}
//Validamos fecha de la cita
if (fechaCita === "") {
    formularioValido = false;
    errores.push("La fecha de la cita no puede estar vacía.");
    document.getElementById("fechaCita").classList.add("campoError");
} else if (fechaSeleccionada < inicioHoy) {
    formularioValido = false;
    errores.push("La fecha de la cita no puede ser anterior a hoy.");
    document.getElementById("fechaCita").classList.add("campoError");
}
// Validamos la hora de la cita
if (horaCita === "") {
    formularioValido = false;
    errores.push("La hora de la cita no puede estar vacía.");
    document.getElementById("horaCita").classList.add("campoError");
} else if (mismoDia) {
    if (
        horaSeleccionada < horaActual ||
        (horaSeleccionada === horaActual && minutosSeleccionados <= minutosActuales)
    ) {
        formularioValido = false;
        errores.push("La hora de la cita ya ha pasado.");
        document.getElementById("horaCita").classList.add("campoError");
    }
} else {
    console.log("La hora de la cita es correcta");
}
      
    console.log(observaciones);  

    console.log(formularioValido);
    if (!formularioValido) {
    errores.forEach(function(error) {
        const mensaje = document.createElement("p");
        mensaje.textContent = error;
        mensajesError.appendChild(mensaje);
    });
}
if (formularioValido) {
    const idCita = citaEditandoId !== null ? citaEditandoId : Date.now();
    const nuevaCita = new Cita (idCita, nombrePaciente, apellidosPaciente, telefonoPaciente, dniPaciente, fechaNacimientoPaciente, fechaCita, horaCita, observaciones);

    if (citaEditandoId !== null) {
        // Buscamos la cita que queremos modificar
        const indice = citas.findIndex(function(cita) {
            return cita.id === citaEditandoId;
        });

        // Sustituimos la cita antigua por la modificada
        if (indice !== -1) {
            citas[indice] = nuevaCita;
        }
        citaEditandoId = null;

    } else {

        // Añadimos una cita nueva
        citas.push(nuevaCita);

    }
    // Guardamos los cambios
    guardarCitas();

    // Actualizamos la tabla
    mostrarCitas();

    // Limpiamos el formulario
    formulario.reset();

    console.log(citas);
    console.log(citas.length);

}
});
