// app.js

document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/articles'; // Replace with your backend URL

    // Create Article
    document.getElementById('createArticleForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const article = {
            local_id: formData.get('local_id'),
            category: formData.get('category'),
            author: formData.get('author'),
            title: formData.get('title'),
            description: formData.get('description'),
            url: formData.get('url'),
            urlToImage: formData.get('urlToImage'),
            publishedAt: formData.get('publishedAt'),
            content: formData.get('content')
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(article)
            });

            if (response.ok) {
                alert('Article created successfully!');
                e.target.reset();
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred while creating the article.');
        }
    });

    // Fetch All Articles
    document.getElementById('fetchAllArticlesBtn').addEventListener('click', async () => {
        try {
            const response = await fetch(API_URL);
            if (response.ok) {
                const articles = await response.json();
                displayArticles(articles);
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred while fetching articles.');
        }
    });

    // Fetch Single Article by ID
    document.getElementById('fetchArticleByIdBtn').addEventListener('click', async () => {
        const articleId = document.getElementById('fetchArticleId').value;

        try {
            const response = await fetch(`${API_URL}/${articleId}`);
            if (response.ok) {
                const article = await response.json();
                displaySingleArticle(article);
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred while fetching the article.');
        }
    });

    // Update Article
    document.getElementById('updateArticleForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const articleId = formData.get('updateArticleId');
        const updatedArticle = {
            title: formData.get('updateTitle'),
            description: formData.get('updateDescription'),
            url: formData.get('updateUrl'),
            publishedAt: formData.get('updatePublishedAt')
        };

        try {
            const response = await fetch(`${API_URL}/${articleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedArticle)
            });

            if (response.ok) {
                alert('Article updated successfully!');
                e.target.reset();
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred while updating the article.');
        }
    });

    // Delete Article
    document.getElementById('deleteArticleBtn').addEventListener('click', async () => {
        // console.log(articleId, results.affectedRows);
        const articleId = document.getElementById('deleteArticleId').value;

        try {
            const response = await fetch(`${API_URL}/${articleId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Article deleted successfully!');
            } else {
                const error = await response.json();
                console.log(error);
                alert(`Error: ${error.error}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred while deleting the article.');
        }
    });

    // Helper function to display articles
    function displayArticles(articles) {
        const articlesList = document.getElementById('articlesList');
        articlesList.innerHTML = '';
        articles.forEach(article => {
            const articleDiv = document.createElement('div');
            articleDiv.classList.add('article');
            articleDiv.innerHTML = `
                <h3>${article.title}</h3>
                <p><strong>Author:</strong> ${article.author}</p>
                <p><strong>Description:</strong> ${article.description}</p>
                <p><strong>Published At:</strong> ${article.publishedAt}</p>
            `;
            articlesList.appendChild(articleDiv);
        });
    }

    // Helper function to display a single article
    function displaySingleArticle(article) {
        const singleArticleDiv = document.getElementById('singleArticle');
        singleArticleDiv.innerHTML = `
            <h3>${article.title}</h3>
            <p><strong>Author:</strong> ${article.author}</p>
            <p><strong>Description:</strong> ${article.description}</p>
            <p><strong>Published At:</strong> ${article.publishedAt}</p>
            <p><strong>Content:</strong> ${article.content}</p>
        `;
    }
});