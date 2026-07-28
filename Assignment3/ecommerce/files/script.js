// Sample Product Data
const products = [
    {
        id: 1,
        name: "Elegant Green Blazer",
        category: "outerwear",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
        description: "A sophisticated green blazer perfect for both business and casual occasions.",
        badge: "New"
    },
    {
        id: 2,
        name: "Pink Silk Blouse",
        category: "tops",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1564257577809-ba7c17d5f22d?w=500",
        description: "Luxurious silk blouse in our signature pink shade.",
        badge: "Bestseller"
    },
    {
        id: 3,
        name: "Floral Summer Dress",
        category: "dresses",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
        description: "Beautiful floral dress perfect for summer occasions.",
        badge: "New"
    },
    {
        id: 4,
        name: "Classic White Shirt",
        category: "tops",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500",
        description: "Timeless white shirt that goes with everything.",
        badge: ""
    },
    {
        id: 5,
        name: "High-Waist Black Trousers",
        category: "bottoms",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500",
        description: "Elegant high-waist trousers for a polished look.",
        badge: ""
    },
    {
        id: 6,
        name: "Maxi Evening Dress",
        category: "dresses",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500",
        description: "Stunning maxi dress for special occasions.",
        badge: "Bestseller"
    },
    {
        id: 7,
        name: "Cozy Knit Sweater",
        category: "tops",
        price: 69.99,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
        description: "Comfortable knit sweater for cooler days.",
        badge: ""
    },
    {
        id: 8,
        name: "Leather Jacket",
        category: "outerwear",
        price: 249.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
        description: "Classic leather jacket with modern styling.",
        badge: "New"
    },
    {
        id: 9,
        name: "Pleated Midi Skirt",
        category: "bottoms",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500",
        description: "Elegant pleated skirt in soft fabric.",
        badge: ""
    },
    {
        id: 10,
        name: "Cocktail Dress",
        category: "dresses",
        price: 169.99,
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
        description: "Perfect cocktail dress for evening events.",
        badge: "Bestseller"
    },
    {
        id: 11,
        name: "Denim Jacket",
        category: "outerwear",
        price: 99.99,
        image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=500",
        description: "Versatile denim jacket for casual styling.",
        badge: ""
    },
    {
        id: 12,
        name: "Linen Wide-Leg Pants",
        category: "bottoms",
        price: 94.99,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
        description: "Comfortable linen pants for effortless style.",
        badge: "New"
    }
];

// Cart Array
let cart = [];

// Current Product for Modal
let currentProduct = null;

// DOM Elements
const loginPage = document.getElementById('loginPage');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const authTabs = document.querySelectorAll('.auth-tab');
const mainNav = document.getElementById('mainNav');
const footer = document.querySelector('.footer');
const logoutBtn = document.getElementById('logoutBtn');
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCartBtns = [document.getElementById('closeCart'), document.getElementById('closeCart2')];
const productsGrid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const navLinks = document.querySelectorAll('.nav-link[data-page]');
const productModal = new bootstrap.Modal(document.getElementById('productModal'));

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        showMainApp();
    }
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
});

// Auth Tab Switching
authTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const targetTab = this.dataset.tab;
        
        // Update active tab
        authTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Update active form
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        
        if (targetTab === 'login') {
            loginForm.classList.add('active');
        } else {
            signupForm.classList.add('active');
        }
    });
});

// Login Form Submit
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    showMainApp();
});

// Signup Form Submit
signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    showMainApp();
});

// Logout
logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    hideMainApp();
});

// Show Main App
function showMainApp() {
    loginPage.classList.remove('active');
    mainNav.style.display = 'block';
    footer.style.display = 'block';
    document.getElementById('homePage').classList.add('active');
    renderProducts('all');
}

// Hide Main App
function hideMainApp() {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    loginPage.classList.add('active');
    mainNav.style.display = 'none';
    footer.style.display = 'none';
    cartSidebar.classList.remove('active');
}

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.dataset.page;
        
        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Show page
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(page + 'Page').classList.add('active');
        
        // Render products if shop page
        if (page === 'shop') {
            renderProducts('all');
        }
    });
});

// Handle data-page buttons (like in hero and collections)
document.addEventListener('click', function(e) {
    if (e.target.matches('[data-page]') || e.target.closest('[data-page]')) {
        const btn = e.target.matches('[data-page]') ? e.target : e.target.closest('[data-page]');
        const page = btn.dataset.page;
        
        // Update navigation
        navLinks.forEach(l => l.classList.remove('active'));
        const targetNavLink = document.querySelector(`.nav-link[data-page="${page}"]`);
        if (targetNavLink) {
            targetNavLink.classList.add('active');
        }
        
        // Show page
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(page + 'Page').classList.add('active');
        
        // Render products if shop page
        if (page === 'shop') {
            renderProducts('all');
            // Reset filter buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
        }
    }
});

// Filter Products
filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const filter = this.dataset.filter;
        
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Render filtered products
        renderProducts(filter);
    });
});

// Render Products
function renderProducts(filter) {
    let filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="col-md-4 col-lg-3">
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h5 class="product-name">${product.name}</h5>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click events to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            openProductModal(productId);
        });
    });
}

// Open Product Modal
function openProductModal(productId) {
    currentProduct = products.find(p => p.id === productId);
    
    if (currentProduct) {
        document.getElementById('modalProductImage').src = currentProduct.image;
        document.getElementById('modalProductName').textContent = currentProduct.name;
        document.getElementById('modalProductPrice').textContent = `$${currentProduct.price.toFixed(2)}`;
        document.getElementById('modalProductDescription').textContent = currentProduct.description;
        
        productModal.show();
    }
}

// Add to Cart
document.getElementById('addToCartBtn').addEventListener('click', function() {
    if (currentProduct) {
        const size = document.getElementById('sizeSelect').value;
        const quantity = parseInt(document.getElementById('quantityInput').value);
        
        // Check if product with same size exists in cart
        const existingItem = cart.find(item => item.id === currentProduct.id && item.size === size);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                ...currentProduct,
                size: size,
                quantity: quantity
            });
        }
        
        updateCartUI();
        saveCart();
        productModal.hide();
        
        // Show cart sidebar
        cartSidebar.classList.add('active');
    }
});

// Cart Icon Click
cartIcon.addEventListener('click', function(e) {
    e.preventDefault();
    cartSidebar.classList.toggle('active');
});

// Close Cart
closeCartBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
    });
});

// Update Cart UI
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag fa-3x mb-3"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = '$0.00';
    } else {
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-size">Size: ${item.size}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

// Update Quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    updateCartUI();
    saveCart();
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    saveCart();
}

// Save Cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Close cart when clicking outside
document.addEventListener('click', function(e) {
    if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
        cartSidebar.classList.remove('active');
    }
});

// Prevent cart sidebar from closing when clicking inside
cartSidebar.addEventListener('click', function(e) {
    e.stopPropagation();
});

// Make functions global for onclick attributes
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
