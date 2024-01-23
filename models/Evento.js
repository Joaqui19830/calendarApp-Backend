const { Schema, model } = require('mongoose');


const EventoSchema = Schema({

    title: {
        type: String,
        required: true,

    },
    notes: {
        type: String,
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, // Esto le indica a mongoose que va a hacer una referencia
        ref: 'Usuario',
        required: true

    }
});

EventoSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject(); // Aca hace referencia a todo el obj que se está serializando
    object.id = _id;
    return object;
})


module.exports = model('Evento', EventoSchema);
