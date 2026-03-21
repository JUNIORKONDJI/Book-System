const sqlite3 = require('sqlite3').verbose();

// Création/Connexion à la base de données locale
const db = new sqlite3.Database('./library.db', (err) => {
    if (err) {
        console.error("Erreur de connexion SQLite:", err.message);
    } else {
        console.log("Connecté à la base SQLite (library.db)");
    }
});

// Initialisation de la table Users
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user'
    )`);
});

db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    description TEXT,
    available BOOLEAN DEFAULT 1
)`);

// --- AJOUT SANS RIEN SUPPRIMER ---
db.run(`CREATE TABLE IF NOT EXISTS borrowings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    book_id INTEGER,
    borrow_date TEXT,
    return_date TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(book_id) REFERENCES books(id)
)`);
// --------------------------------

module.exports = db;