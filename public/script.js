document.addEventListener('DOMContentLoaded', () => {
    const articleList = document.getElementById('article-list');
    const articleForm = document.getElementById('article-form');
  
    // Fetch and display articles
    async function fetchArticles() {
      try {
        const response = await fetch('http://localhost:3000/articles');
        const articles = await response.json();
        articleList.innerHTML = ''; // Clear previous articles
        articles.forEach(article => {
          const articleCard = document.createElement('div');
          articleCard.classList.add('article-card');
          articleCard.innerHTML = `
            <img src="${article.urlToImage || 'https://via.placeholder.com/300'}" alt="${article.title}">
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Read More</a>
          `;
          articleList.appendChild(articleCard);
        });
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    }
  
    // Add new article
    articleForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        local_id: document.getElementById('local_id').value,
        category: document.getElementById('category').value,
        author: document.getElementById('author').value,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        url: document.getElementById('url').value,
        urlToImage: document.getElementById('urlToImage').value,
        publishedAt: document.getElementById('publishedAt').value,
        content: document.getElementById('content').value
      };
  
      try {
        const response = await fetch('http://localhost:3000/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
  
        if (response.ok) {
          alert('Article added successfully!');
          fetchArticles(); // Refresh the article list
          articleForm.reset();
        } else {
          alert('Failed to add article.');
        }
      } catch (error) {
        console.error('Error adding article:', error);
      }
    });
  
    // Initial fetch
    fetchArticles();
  });