let allRecipes = [];
let activeCategory = 'Todos';

async function init() {
    try {
        const response = await fetch('assets/data/recipes.json');
        allRecipes = await response.json();
        
        // --- NUEVO: Leer categoría de la URL al cargar ---
        const hash = decodeURIComponent(window.location.hash.substring(1));
        if (hash && hash !== "") {
            activeCategory = hash;
        }
        // ------------------------------------------------
        
        setupCategories();
        renderRecipes(allRecipes);
        handleSearch(); // Ejecutamos búsqueda inicial por si hay categoría en URL
        
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
    
    // --- NUEVO: Actualizar la URL al hacer clic ---
    if (cat === 'Todos') {
        history.pushState(null, null, window.location.pathname);
    } else {
        window.location.hash = encodeURIComponent(cat);
    }
    // ----------------------------------------------
    
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

// ... (el resto de tus funciones renderRecipes, openModal, etc. se mantienen igual)