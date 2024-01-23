// const express = require('express')
const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

// Esto es para tener la ayuda del res.json(), res.send(), etc
const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            })
        }

        // Este usuario le cae a la instancia anterior por eso no hay ningun inconveniente.
        usuario = new Usuario(req.body);

        // Encriptar contraseña  
        const salt = bcrypt.genSaltSync(); // La cantidad de vueltas para encriptar pero es mas pesada si lo dejamos asi toma 10 vueltas por defeecto
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

}

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            res.status(400).json({
                ok: false,
                msg: 'Un usuario no existe con ese email'
            })
        }

        // Confirmar los password
        // Aca hacemos la comparacion del password '123456' con el password de la bd que está encriptada
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token

        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const revalidarToken = async (req, res = response) => {

    const { uid, name } = req;


    // Generar un nuevo jwt y retornarlo en esta peticion 
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        token
    });
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}



