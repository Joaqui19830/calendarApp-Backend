const { response } = require('express');
const Evento = require('../models/Evento'); // Como es importacion por defecto no se usan las llaves


const getEvento = async (req, res = response) => {

    const eventos = await Evento.find()
        .populate('user', 'name');// Populate rellena toda la info que trae user como el name, etc               
    res.json({
        ok: true,
        eventos
    })

}
const crearEvento = async (req, res = response) => {
    // Verificar que tenga el evento
    // console.log(req.body);

    const evento = new Evento(req.body);

    try {
        evento.user = req.uid; // Aca capturamos el uid
        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}
const actualizarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                mgs: 'No tiene privilegio de editar éste evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        // El new es para que tome el ultimo valor actualiado 
        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }


}
const eliminarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                mgs: 'No tiene privilegio para eliminar éste evento'
            });
        }

        await Evento.findByIdAndDelete(eventoId);

        res.json({
            ok: true
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


module.exports = {
    getEvento,
    crearEvento,
    actualizarEvento,
    eliminarEvento

}


