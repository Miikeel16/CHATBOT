const express = require('express');
const mysql = require('mysql2');
// const cors = require('cors');

const app = express();
const port = 3301;

// Middleware
// app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost', // Cambia esto si tu contenedor tiene un nombre diferente
    user: 'chatbot',
    password: 'chatbot', // Cambia esto por tu contraseña
    database: 'chatbot' // Asegúrate de que esta base de datos exista
});

// Conectar a la base de datos
db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

// Rutas para manejar los mensajes
app.post('/messages', (req, res) => {
    const { title, content, type } = req.body;
    if (title && content && type) {
        db.query('INSERT INTO messages (title, content, type) VALUES (?, ?, ?)', [title, content, type],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({ error: 'Error al insertar el mensaje' });
                }
                res.status(200).send({ message: 'Insert recibido' })
            });
    } else {
        res.status(400).send({ error: 'Faltan campos requeridos' });
    }
});

app.get('/messages', (req, res) => {
    db.query('SELECT * FROM messages', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: 'Error al obtener mensajes' })
        };
        res.status(200).send(results);
    });
});

app.delete('/messages/:title', (req, res) => {
    const { title } = req.params;
    if (title) {
        db.query('DELETE FROM messages WHERE title = ?', [title], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ error: 'Error al borrar mensajes' })
            };
            res.status(200).send({ message: 'Mensaje eliminado' });
        });
    } else {
        res.status(400).send({ error: 'Faltan campos requeridos' });
    }
});

app.delete('/messages', (req, res) => {
    db.query('DELETE FROM messages', (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: 'Error al borrar mensajes' });
        }
        res.status(200).send({ message: 'Todos los mensajes eliminados' });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});