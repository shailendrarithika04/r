// Product Data with Images
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        price: 999,
        category: "electronics",
        image: "images/product1.jpg",
        rating: 4.8,
        reviews: 1247
    },
    {
        id: 2,
        name: "Samsung Galaxy S24",
        price: 899,
        category: "electronics",
        image: "images/product2.jpg",
        rating: 4.7,
        reviews: 987
    },
    {
        id: 3,
        name: "MacBook Pro 14\"",
        price: 1999,
        category: "electronics",
        image: "images/product3.jpg",
        rating: 4.9,
        reviews: 543
    },
    {
        id: 4,
        name: "Nike Air Max 90",
        price: 129,
        category: "clothing",
        image: "images/product4.jpg",
        rating: 4.6,
        reviews: 456
    },
    {
        id: 5,
        name: "Adidas Ultraboost",
        price: 189,
        category: "clothing",
        image: "images/product5.jpg",
        rating: 4.8,
        reviews: 789
    },
    {
        id: 6,
        name: "Sony WH-1000XM5",
        price: 399,
        category: "electronics",
        image: "images/product6.jpg",
        rating: 4.9,
        reviews: 2345
    },
    {
        id: 7,
        name: "Coffee Maker Pro",
        price: 89,
        category: "home",
        image: "images/product7.jpg",
        rating: 4.5,
        reviews: 345
    },
    {
        id: 8,
        name: "Gaming Chair RGB",
        price: 299,
        category: "home",
        image: "images/product8.jpg",
        rating: 4.7,
        reviews: 678
    },
    {
        id: 9,
        name: "Yoga Mat Premium",
        price: 45,
        category: "sports",
        image: "images/product9.jpg",
        rating: 4.6,
        reviews: 234
    },
    {
        id: 10,
        name: "Apple Watch Ultra",
        price: 799,
        category: "electronics",
        image: "images/product10.jpg",
        rating: 4.8,
        reviews: 890
    },
    {
        id: 11,
        name: "JBL Bluetooth Speaker",
        price: 149,
        category: "electronics",
        image: "images/product11.jpg",
        rating: 4.7,
        reviews: 567
    },
    {
        id: 12,
        name: "Smart Desk Lamp",
        price: 79,
        category: "home",
        image: "images/product12.jpg",
        rating: 4.6,
        reviews: 123
    }
];

// Global state
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let filteredProducts = [...products];
let currentPage = 'home';

// Utility Functions
function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function renderProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}">
            <div class="product-image" style="background-image: url('${product.image}')">
                ${product.image.includes('images/') ? '' : '<div class="no-image">No Image</div>'}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="rating">
                    <div class="stars">${renderStars(product.rating)}</div>
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-price">$${product.price}</div>
                <div class="product-actions">
                    <button class="add-to-cart">Add to Cart</button>
                    <button class="add-to-wishlist" data-id="${product.id}">
                        ${wishlist.some(p => p.id === product.id) ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>'}
                    </button>
                </div>
                <div class="product-category">${product.category.toUpperCase()}</div>
            </div>
        </div>
    `;
}

function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = products.slice(0, 8).map(renderProductCard).join('');
}

// Wishlist Functions
function toggleWishlist(productId) {
    const index = wishlist.findIndex(p => p.id === productId);
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        const product = products.find(p => p.id === productId);
        wishlist.push(product);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistIcon();
    renderProducts(filteredProducts, currentPage === 'products' ? 'productsGrid' : 'featuredProducts');
}

function updateWishlistIcon() {
    const icon = document.getElementById('wishlistIcon');
    if (icon) {
        icon.style.color = wishlist.length > 0 ? '#e74c3c' : '#333';
        icon.title = `Wishlist (${wishlist.length})`;
    }
}

// Search Function
function searchProducts(query) {
    if (!query.trim()) {
        filteredProducts = [...products];
        return;
    }
    filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.includes(query.toLowerCase())
    );
}

// Filter Functions (Products Page)
function applyFilters() {
    let filtered = [...products];
    
    // Category filter
    const categoryChecks = document.querySelectorAll('input[type="checkbox"][value]');
    const selectedCategories = Array.from(categoryChecks)
        .filter(cb => cb.checked && cb.value !== 'all')
        .map(cb => cb.value);
    
    if (selectedCategories.length > 0) {
        filtered = filtered.filter(product => selectedCategories.includes(product.category));
    }
    
    // Price filter
    const priceValue = parseInt(document.getElementById('priceFilter')?.value || 1000);
    filtered = filtered.filter(product => product.price <= priceValue);
    
    // Search filter
    const searchInput = document.querySelector('.search-input');
    if (searchInput.value.trim()) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchInput.value.toLowerCase())
        );
    }
    
    filteredProducts = filtered;
    renderProducts(filteredProducts, 'productsGrid');
}

// Sort Products
function sortProducts(sortBy) {
    let sorted = [...filteredProducts];
    switch(sortBy) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        default:
            sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    filteredProducts = sorted;
    renderProducts(filteredProducts, 'productsGrid');
}

// Initialize Page
function initPage() {
    const currentPath = window.location.pathname.split('/').pop();
    currentPage = currentPath === 'products.html' ? 'products' : 
                  currentPath === 'contact.html' ? 'contact' : 'home';
    
    updateWishlistIcon();
    
    if (currentPage === 'home') {
        renderProducts(products, 'featuredProducts');
        setupCategoryCards();
    } else if (currentPage === 'products') {
        renderProducts(products, 'productsGrid');
        setupProductsPage();
    } else if (currentPage === 'contact') {
        setupContactForm();
    }
    
    setupCommonFeatures();
}

function setupCategoryCards() {
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            window.location.href = `products.html?category=${category}`;
        });
    });
}

function setupProductsPage() {
    // Category filters
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });
    
    // Price filter
    const priceSlider = document.getElementById('priceFilter');
    const priceValue = document.getElementById('priceValue');
    if (priceSlider && priceValue) {
        priceSlider.addEventListener('input', (e) => {
            priceValue.textContent = `$${e.target.value}`;
            applyFilters();
        });
    }
    
    // Sort dropdown
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortProducts(e.target.value);
        });
    }
    
    // Clear filters
    document.querySelector('.clear-filters')?.addEventListener('click', () => {
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelector('input[value="all"]').checked = true;
        document.getElementById('priceFilter').value = 1000;
        document.getElementById('priceValue').textContent = '$1000';
        document.querySelector('.search-input').value = '';
        renderProducts(products, 'productsGrid');
    });
}

function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            form.reset();
        });
    }
}

function setupCommonFeatures() {
    // Search functionality
    document.querySelectorAll('.search-input').forEach(input => {
        input.addEventListener('input', (e) => {
            searchProducts(e.target.value);
            if (currentPage === 'products') {
                filteredProducts = filteredProducts.filter(p => 
                    p.name.toLowerCase().includes(e.target.value.toLowerCase())
                );
                renderProducts(filteredProducts, 'productsGrid');
            }
        });
    });
    
    // Search icon click
    document.querySelectorAll('.search-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const input = icon.parentElement.querySelector('.search-input');
            input.focus();
        });
    });
    
    // Wishlist icon click
    document.getElementById('wishlistIcon')?.addEventListener('click', () => {
        alert(`Wishlist: ${wishlist.length} items\n${wishlist.map(p => p.name).join(', ')}`);
    });
    
    // Product card interactions
    document.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-wishlist')) {
            const productId = parseInt(e.target.closest('.add-to-wishlist').dataset.id);
            toggleWishlist(productId);
        }
        
        if (e.target.closest('.add-to-cart')) {
            alert('Added to cart! (Cart functionality can be extended)');
        }
    });
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', initPage);
