const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();

// console.log(process.env);


// Crear el servidor de express
const app = express();

// Base de datos
dbConnection();

// CORS
app.use(cors())


// Directorio Publico
//Medleware es una simple funcion que se ejecuta siempre que pase por algun lugar
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());



// Rutas
app.use('/api/auth', require('./routes/auth'));
//TODO: CRUD: eventos





// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo el en puerto ${process.env.PORT}`)
})