let allRecipes = [];
let activeCategory = 'Todos';

async function init() {
    try {
        const response = await fetch('assets/data/recipes.json');
        allRecipes = await response.json();
        
        setupCategories();
        renderRecipes(allRecipes);
        
        document.getElementById('search').addEventListener('input', handleSearch);
    } catch (error) {
        console.error('Error loading recipes:', error);
    }
}

function setupCategories() {
    const categories = ['Todos', ...new Set(allRecipes.map(r => r.category))];
    const container = document.getElementById('categories');
    
    container.innerHTML = categories.map(cat => `
        <button class="category-btn ${cat === activeCategory ? 'active' : ''}" onclick="filterByCategory('${cat}')">
            ${cat}
        </button>
    `).join('');
}

function filterByCategory(cat) {
    activeCategory = cat;
    setupCategories();
    handleSearch();
}

function handleSearch() {
    const query = document.getElementById('search').value.toLowerCase();
    const filtered = allRecipes.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(query) || 
                            r.category.toLowerCase().includes(query) ||
                            r.description.toLowerCase().includes(query);
        const matchesCategory = activeCategory === 'Todos' || r.category === activeCategory;
        return matchesSearch && matchesCategory;
    });
    renderRecipes(filtered);
}

function renderRecipes(recipes) {
    const container = document.getElementById('recipe-grid');
    if (recipes.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px;">No se encontraron recetas :(</div>';
        return;
    }
    
    container.innerHTML = recipes.map(r => `
        <div class="recipe-card" onclick="showRecipe('${r.id}')">
            <div class="img-wrapper">
                <img src="${r.image || 'https://via.placeholder.com/400x300?text=No+Image'}" alt="${r.name}" loading="lazy">
            </div>
            <div class="content">
                <span class="category">${r.category}</span>
                <h3>${r.name}</h3>
                <div class="meta">
                    ${r.cook_time ? `<span>⏱ ${r.cook_time}</span>` : ''}
                    ${r.servings ? `<span>🍴 ${r.servings}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function showRecipe(id) {
    const r = allRecipes.find(res => res.id === id);
    if (!r) return;
    
    const modal = document.getElementById('recipe-modal');
    const content = document.getElementById('modal-body');
    
    content.innerHTML = `
        <div class="modal-header">
            <img src="${r.image || 'https://via.placeholder.com/400x300?text=No+Image'}" class="modal-img" alt="${r.name}">
            <div class="modal-info">
                <span class="category">${r.category}</span>
                <h2>${r.name}</h2>
                <div class="meta">
                    ${r.prep_time ? `<div><strong>Prep:</strong> ${r.prep_time}</div>` : ''}
                    ${r.cook_time ? `<div><strong>Cocción:</strong> ${r.cook_time}</div>` : ''}
                    ${r.servings ? `<div><strong>Porciones:</strong> ${r.servings}</div>` : ''}
                </div>
                <p style="margin-top: 20px;">${r.description}</p>
            </div>
        </div>
        <div class="recipe-details">
            <div class="ingredients-section">
                <h3 class="section-title">Ingredientes</h3>
                <ul class="ingredients-list">
                    ${r.ingredients.map(i => `<li>${i}</li>`).join('')}
                </ul>
            </div>
            <div class="instructions-section">
                <h3 class="section-title">Instrucciones</h3>
                <ol class="instructions-list">
                    ${r.instructions.map(i => `<li>${i}</li>`).join('')}
                </ol>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('recipe-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    const modal = document.getElementById('recipe-modal');
    if (event.target == modal) {
        closeModal();
    }
}

init();
