class Usuarios {

    constructor() {
        this.personas = []; //inicialimos el array de personas
    }

    agregarPersona(id, nombre, sala) {
        let persona = {
            id,
            nombre,
            sala
        }
        this.personas.push(persona);
        return this.personas;
    }

    getPersona(id) {
        let persona = this.personas.filter(pers => {
            return pers.id === id
        })[0];

        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        let personasEnSala = this.personas.filter(persona => {
            return persona.sala === sala
        })
        return personasEnSala;
    }

    borrarPersona(id) { //busco todas las personas con id diferente y las asigno a personas
        let personaBorrada = this.getPersona(id);

        this.personas = this.personas.filter(pers => {
            return pers.id != id
        });
        return personaBorrada;
    }
}

module.exports = { Usuarios }