/*
 Event Routes
 /api/events

*/

const { Router } = require("express");
const { getEvento, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");
const { validarJWT } = require("../middlewares/validar-jwt");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");


const router = Router();

// Todas tienen que pasar por la validacion de JWT
// Para validar todas se puede hacer asi 
router.use(validarJWT);

// Obtener eventos
router.get('/', getEvento);


// Crear Eventos
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
        validarCampos
    ],
    crearEvento
);


// Actualizar Eventos
router.put(
    '/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
        validarCampos
    ],
    actualizarEvento)

// Eliminar Eventos
router.delete('/:id', eliminarEvento)

module.exports = router;