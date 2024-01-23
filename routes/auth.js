/*
    Rutas de Usuarios / Auth
    host + api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.post(
    '/new',
    [ // Esto es una coleccion de middleware

        check('name', 'El nombre es obligatorio').not().isEmpty(), // Lo que dice es que el nombre debe ser obligatorio y que no esté vacio 
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos

    ],
    crearUsuario
);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario
);

// Aca como es solo un meddleware se manda asi 
router.get('/renew', validarJWT, revalidarToken);


module.exports = router;