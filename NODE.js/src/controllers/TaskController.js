function index(req, res) {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuarios', (err, usuarios) => {
            if(err) {        
                res.json(err);
        }
        res.render('tasks/index', {usuarios});
        });
    });

    
}

function create(req, res) {

    res.render('tasks/create');
}

//Módulo para renderizar vistas
const path = require('path');

function store(req, res) {
    const data = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            res.send('Error al agregar usuario: ' + err);
        }
        conn.query('INSERT INTO usuarios SET ?', [data], (err, rows) => {
            if (err) {
                res.send('Error al agregar usuario: ' + err);
            }
            // Renderiza la vista ingresarMSJ.hbs después de agregar el usuario exitosamente
            res.render(path.join(__dirname, '../views/ingresarMSJ'));
        });
    });
}

function destroy(req, res) {
    const ci = req.body.ci;

    req.getConnection((err, conn) => {
        if (err) {
            res.send('Error al eliminar usuario: ' + err);
        }
        conn.query('DELETE FROM usuarios WHERE ci = ?', [ci], (err, rows) => {
            if (err) {
                res.send('Error al eliminar usuario: ' + err);
            }
            // Renderiza la vista eliminarMSJ.hbs después de eliminar exitosamente el usuario
            res.render(path.join(__dirname, '../views/eliminarMSJ'));
        });
    });
}


function edit(req, res) {
    const ci = req.params.ci;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuarios WHERE ci = ?', [ci], (err, usuarios) => {
            if(err) {        
                res.json(err);
            }
        res.render('tasks/edit', {usuarios});
        });
    });
}

function update(req, res) {
    const ci = req.params.ci;
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('UPDATE usuarios SET ? WHERE ci = ?', [data, ci], (err, rows) => {
            res.redirect('/tasks')
        });
    });

}
module.exports = { 
    index: index, 
    create: create,
    store: store,
    destroy: destroy,
    edit: edit,
    update: update,
}