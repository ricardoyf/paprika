let allRecipes = [];
let activeCategory = 'Todos';

async function init() {
    try {
        const response = await fetch('assets/data/recipes.json');
        allRecipes = await response.json();
        
        // Leer categoría de la URL al cargar (#NOMBRE)
        const hash = decodeURIComponent(window.location.hash.substring(1));
        if (hash && hash !== "") {
            activeCategory = hash;
        }
        
        setupCategories();
        handleSearch(); // Esto renderiza las recetas iniciales
        
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
    
    if (cat === 'Todos') {
        history.pushState(null, null, window.location.pathname);
    } else {
        window.location.hash = encodeURIComponent(cat);
    }
    
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
    const grid = document.getElementById('recipe-grid');
    grid.innerHTML = recipes.map(r => `
        <div class="recipe-card" onclick='openModal(${JSON.stringify(r).replace(/'/g, "&apos;")})'>
            <img src="${r.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800'}" 
                 class="recipe-image" alt="${r.name}">
            <div class="recipe-content">
                <span class="category">${r.category}</span>
                <h2 class="recipe-title">${r.name}</h2>
                <p class="recipe-description">${r.description.substring(0, 100)}${r.description.length > 100 ? '...' : ''}</p>
            </div>
        </div>
    `).join('');
}

function openModal(r) {
    const modal = document.getElementById('recipe-modal');
    const content = document.getElementById('modal-body');
    
    content.innerHTML = `
        <div class="modal-header">
            <img src="${r.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800'}" 
                 style="width: 100%; height: 300px; object-fit: cover; border-radius: 12px; margin-bottom: 20px;">
            <div>
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