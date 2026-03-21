const express = require("express");
const db = require('./config/db');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;
const SECRET = "ton_secret_key"; // pour JWT

app.use(express.json());

app.get("/", (req, res) => res.send("Serveur prêt !"));
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.run(sql, [username, email, hashedPassword], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Utilisateur créé", userId: this.lastID });
    });
});
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: "Mot de passe incorrect" });

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: "1h" });
        res.json({ message: "Connexion réussie", token });
    });
});
app.get("/users", (req, res) => {
    db.all("SELECT id, username, email, role FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']; // Vérifie bien l'orthographe !
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}
app.post("/books", (req, res) => {
    const { title, author, description } = req.body;
    const sql = `INSERT INTO books (title, author, description) VALUES (?, ?, ?)`;
    db.run(sql, [title, author, description], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Livre ajouté", bookId: this.lastID });
    });
});
app.post("/borrow", authenticateToken, (req, res) => {
    const { user_id, book_id } = req.body;

    db.get("SELECT * FROM books WHERE id = ?", [book_id], (err, book) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!book) return res.status(404).json({ error: "Livre introuvable" });
        if (!book.available) return res.status(400).json({ error: "Livre déjà emprunté" });

        db.run("INSERT INTO borrowings (user_id, book_id) VALUES (?, ?)", [user_id, book_id], function(err) {
            if (err) return res.status(500).json({ error: err.message });

            db.run("UPDATE books SET available = 0 WHERE id = ?", [book_id]);
            res.json({ message: "Livre emprunté", borrowId: this.lastID });
        });
    });
});
app.post("/return", authenticateToken, (req, res) => {
    const { borrow_id } = req.body;

    db.get("SELECT * FROM borrowings WHERE id = ?", [borrow_id], (err, borrow) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!borrow) return res.status(404).json({ error: "Emprunt introuvable" });

        db.run("UPDATE borrowings SET return_date = datetime('now') WHERE id = ?", [borrow_id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            db.run("UPDATE books SET available = 1 WHERE id = ?", [borrow.book_id]);
            res.json({ message: "Livre retourné avec succès" });
        });
    });
});
app.get("/borrowings", (req, res) => {
    const sql = `
        SELECT borrowings.id, users.username, books.title, borrowings.borrow_date, borrowings.return_date
        FROM borrowings
        JOIN users ON borrowings.user_id = users.id
        JOIN books ON borrowings.book_id = books.id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.get("/books", (req, res) => {
    db.all("SELECT * FROM books", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
// Route pour voir mes emprunts (SÉCURISÉE)
app.get('/my-borrows/:user_id', authenticateToken, (req, res) => {
    const userId = req.params.user_id;

    const sql = `
        SELECT borrowings.id, books.title, books.author, borrowings.borrow_date 
        FROM borrowings 
        JOIN books ON borrowings.book_id = books.id 
        WHERE borrowings.user_id = ?
    `;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la récupération" });
        }
        res.json(rows);
    });
});
const cors = require('cors'); // On appelle le garde du corps
app.use(cors()); // On lui dit de laisser passer tout le monde (pour le développement)
app.get('/my-borrows/:user_id', authenticateToken, (req, res) => {
    const userId = req.params.user_id;
    const sql = `
        SELECT borrowings.id AS borrow_id, books.title, books.author 
        FROM borrowings 
        JOIN books ON borrowings.book_id = books.id 
        WHERE borrowings.user_id = ?`;

    db.all(sql, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));