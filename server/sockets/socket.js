const { io } = require('../server');
const { Usuarios } = require('../clases/usuarios')
const { crearMensaje } = require('../utilidades/utilidades')

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {
        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                mensaje: 'el nombre/sala es necesario'
            });
        }
        //lo unimos a la sala
        client.join(usuario.sala);

        let personas = usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);
        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala));
        callback(usuarios.getPersonasPorSala(usuario.sala));

    });

    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    })

    client.on('disconnect', () => {
        let personaborrada = usuarios.borrarPersona(client.id);

        //cuando una persona se va del chat emitimos un evento a todos los usuarios
        client.broadcast.to(personaborrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaborrada.nombre} salió`));
        client.broadcast.to(personaborrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaborrada.sala));
    });

    //mensaje privados
    client.on('mensajePrivado', data => {
        //tiene que venir el id en la data
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    })
});