const sqlite3 = require('sqlite3').verbose();

class Task {
  constructor(title, description, price) {
    this.title = title;
    this.description = description;
    this.price = price;
  }

  static getAllTasks(callback) {
    const db = new sqlite3.Database('./data/db.sqlite');
    db.all('SELECT * FROM tasks', (err, rows) => {
      if (err) {
        console.error(err);
        callback(err, null);
        return;
      }
      callback(null, rows);
    });
    db.close();
  }

  static createTask(newTask, callback) {
    const db = new sqlite3.Database('./data/db.sqlite');
    db.run('INSERT INTO tasks (title, description, price) VALUES (?, ?, ?)',
      [newTask.title, newTask.description, newTask.price], function(err) {
        if (err) {
          console.error(err);
          callback(err, null);
          return;
        }
        callback(null, { id: this.lastID, ...newTask });
      });
    db.close();
  }

  static updateTask(id, updatedTask, callback) {
    const db = new sqlite3.Database('./data/db.sqlite');
    db.run('UPDATE tasks SET title=?, description=?, price=? WHERE id=?',
      [updatedTask.title, updatedTask.description, updatedTask.price, id], function(err) {
        if (err) {
          console.error(err);
          callback(err, null);
          return;
        }
        if (this.changes === 0) {
          callback({ message: 'Task not found' }, null);
          return;
        }
        callback(null, { id, ...updatedTask });
      });
    db.close();
  }

  static deleteTask(id, callback) {
    const db = new sqlite3.Database('./data/db.sqlite');
    db.run('DELETE FROM tasks WHERE id=?', id, function(err) {
      if (err) {
        console.error(err);
        callback(err, null);
        return;
      }
      if (this.changes === 0) {
        callback({ message: 'Task not found' }, null);
        return;
      }
      callback(null, { message: 'Task deleted successfully' });
    });
    db.close();
  }
}

module.exports = Task;
