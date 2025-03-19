const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an instance of Express
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" folder
app.use(express.static('public'));

// Create a MySQL connection pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'root', 
    password: 'pollob12', 
    database: 'the_global_lens'
});

// Test the database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
    connection.release();
});

// GET all articles
app.get('/articles', (req, res) => {
    db.query('SELECT * FROM articles', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// GET a single article by ID
app.get('/articles/:id', (req, res) => {
    const articleId = req.params.id;
    db.query('SELECT * FROM articles WHERE ID = ?', [articleId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.json(results[0]);
    });
});

// POST a new article
app.post('/articles', (req, res) => {
    const { local_id, category, author, title, description, url, urlToImage, publishedAt, content } = req.body;
    if (!title || !description || !url || !publishedAt) {
        return res.status(400).json({ error: 'Title, description, URL, and publishedAt are required' });
    }
    db.query(
        'INSERT INTO articles (local_id, category, author, title, description, url, urlToImage, publishedAt, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [local_id, category, author, title, description, url, urlToImage, publishedAt, content],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database insertion failed' });
            }
            res.status(201).json({ id: results.insertId, local_id, category, author, title, description, url, urlToImage, publishedAt, content });
        }
    );
});

// PUT (update) an article by ID
app.put('/articles/:id', (req, res) => {
    const articleId = req.params.id;
    const { local_id, category, author, title, description, url, urlToImage, publishedAt, content } = req.body;
    if (!title || !description || !url || !publishedAt) {
        return res.status(400).json({ error: 'Title, description, URL, and publishedAt are required' });
    }
    db.query(
        'UPDATE articles SET local_id = ?, category = ?, author = ?, title = ?, description = ?, url = ?, urlToImage = ?, publishedAt = ?, content = ? WHERE ID = ?',
        [local_id, category, author, title, description, url, urlToImage, publishedAt, content, articleId],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database update failed' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Article not found' });
            }
            res.json({ id: articleId, local_id, category, author, title, description, url, urlToImage, publishedAt, content });
        }
    );
});

// DELETE an article by ID
app.delete('/articles/:id', (req, res) => {
    const articleId = req.params.id;
    db.query('DELETE FROM articles WHERE ID = ?', [articleId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database deletion failed' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.json({ message: 'Article deleted successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});