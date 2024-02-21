const express = require('express');
const { engine } = require('express-handlebars');
const myconnection = require('express-myconnection');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const tasksRoutes = require('./routes/tasks'); 

const app = express();
const port = 3000;

// Configuración de Handlebars
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.engine('.hbs', engine({
  extname: '.hbs' 
 }));  

app.set('view engine', 'hbs')

app.use(bodyParser.json());

app.use(myconnection(mysql, {
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306,
  database: 'pruebaapi'
}));

// Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.status(500).send(err);
    } else {
      conn.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json(results);
        }
      });
    }
  });
});

// Agregar un nuevo usuario
app.post('/usuarios', (req, res) => {
  const nuevoUsuario = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      res.status(500).send(err);
    } else {
      conn.query('INSERT INTO usuarios SET ?', nuevoUsuario, (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(201).send('Usuario agregado');
        }
      });
    }
  });
});

// Actualizar un usuario por su cédula de identidad (ci)
app.put('/usuarios/:ci', (req, res) => {
  const ci = req.params.ci;
  const datosActualizados = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      res.status(500).send(err);
    } else {
      conn.query('UPDATE usuarios SET ? WHERE ci = ?', [datosActualizados, ci], (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send('Usuario actualizado');
        }
      });
    }
  });
});


// Eliminar un usuario por su cédula de identidad (ci)
app.delete('/usuarios/:ci', (req, res) => {
  const ci = req.params.ci;
  req.getConnection((err, conn) => {
    if (err) {
      res.status(500).send(err);
    } else {
      conn.query('DELETE FROM usuarios WHERE ci = ?', [ci], (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send('Usuario eliminado');
        }
      });
    }
  });
});

app.use('/', tasksRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`Servidor activo en el puerto ${port}`);
});
