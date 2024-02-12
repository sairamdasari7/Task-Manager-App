const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/db.sqlite');

// Create Tasks table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        price REAL
    )`);

    // Insert sample data
    const insertSampleData = db.prepare(`INSERT INTO tasks (title, description, price) VALUES (?, ?, ?)`);

    insertSampleData.run('Task 1', 'Description for Task 1', 10.99);
    insertSampleData.run('Task 2', 'Description for Task 2', 20.50);
    insertSampleData.run('Task 3', 'Description for Task 3', 15.75);

    insertSampleData.finalize();
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error('Error closing database connection:', err.message);
    } else {
        console.log('Database setup completed. SQLite file created with Tasks table and sample data.');
    }
});
