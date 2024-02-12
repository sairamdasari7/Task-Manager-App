const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/db.sqlite');

exports.getAllTasks = (req, res) => {
    db.all('SELECT * FROM tasks', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(rows);
    });
};

exports.createTask = (req, res) => {
    const { title, description, price } = req.body;
    if (!title || !description || !price) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    db.run('INSERT INTO tasks (title, description, price) VALUES (?, ?, ?)', [title, description, price], function(err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ id: this.lastID, title, description, price });
    });
    console.log('Received request to create task:', req.body);
};

exports.updateTask = (req, res) => {
    const { title, description, price } = req.body;
    const taskId = req.params.id;
    if (!title || !description || !price || !taskId) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    db.run('UPDATE tasks SET title=?, description=?, price=? WHERE id=?', [title, description, price, taskId], function(err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json({ id: taskId, title, description, price });
    });
};

exports.deleteTask = (req, res) => {
    const taskId = req.params.id;
    if (!taskId) {
        res.status(400).json({ error: 'Missing task ID' });
        return;
    }
    db.run('DELETE FROM tasks WHERE id=?', taskId, function(err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json({ message: 'Task deleted successfully' });
    });
};
