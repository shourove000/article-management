const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Database config
const dbConfig = {
    host: 'sql12.freesqldatabase.com',
    user: 'sql12809946',
    password: 'pp77dcgBZD',
    port: 10952,
    database: 'sql12809946'
};

const db = mysql.createPool(dbConfig);

// Routes
app.get('/articles', (req, res) => {
    db.query('SELECT * FROM articles', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    });
});

app.get('/articles/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM articles WHERE ID = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (results.length === 0) return res.status(404).json({ error: 'Article not found' });
        res.json(results[0]);
    });
});

app.post('/articles', (req, res) => {
    const { local_id, category, author, title, description, url, urlToImage, publishedAt, content } = req.body;

    if (!title || !description || !url || !publishedAt)
        return res.status(400).json({ error: 'Title, description, URL, and publishedAt are required' });

    db.query(
        'INSERT INTO articles (local_id, category, author, title, description, url, urlToImage, publishedAt, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [local_id, category, author, title, description, url, urlToImage, publishedAt, content],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Database insertion failed' });
            res.status(201).json({ id: results.insertId, ...req.body });
        }
    );
});

app.put('/articles/:id', (req, res) => {
    const id = req.params.id;
    const { local_id, category, author, title, description, url, urlToImage, publishedAt, content } = req.body;

    if (!title || !description || !url || !publishedAt)
        return res.status(400).json({ error: 'Missing required fields' });

    db.query(
        'UPDATE articles SET local_id=?, category=?, author=?, title=?, description=?, url=?, urlToImage=?, publishedAt=?, content=? WHERE ID=?',
        [local_id, category, author, title, description, url, urlToImage, publishedAt, content, id],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Database update failed' });
            if (results.affectedRows === 0) return res.status(404).json({ error: 'Article not found' });
            res.json({ id, ...req.body });
        }
    );
});

app.delete('/articles/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM articles WHERE ID=?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database deletion failed' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Article not found' });
        res.json({ message: 'Article deleted successfully' });
    });
});

// ❌ DO NOT USE app.listen() on Vercel
// app.listen(port, () => console.log("Server running"));

module.exports = app;
module.exports.handler = serverless(app);
