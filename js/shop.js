const SHOP_CONFIG = {
    itemsPerPage: 8,
    animationDuration: 300,
    cartAnimationDuration: 500
};

const shopItems = [
    {
        id: 1,
        name: 'VIP Role',
        category: 'discord',
        price: 9.99,
        description: 'Exclusive VIP role with special permissions and custom color',
        features: ['Custom Color', 'Special Permissions', 'Priority Support'],
        image: 'fas fa-crown',
        badge: 'Discord',
        popular: true
    },
    {
        id: 2,
        name: 'Private Voice Channel',
        category: 'discord',
        price: 14.99,
        description: 'Your own private voice channel with custom settings',
        features: ['Private Access', 'Custom Settings', 'User Limit Control'],
        image: 'fas fa-microphone',
        badge: 'Discord',
        popular: false
    },
    {
        id: 3,
        name: 'Custom Emoji Pack',
        category: 'discord',
        price: 4.99,
        description: 'Exclusive custom emojis for the server',
        features: ['10 Custom Emojis', 'High Quality', 'Server Exclusive'],
        image: 'fas fa-palette',
        badge: 'Discord',
        popular: false
    },
    {
        id: 4,
        name: 'Content Creator Role',
        category: 'content',
        price: 19.99,
        description: 'Special role for content creators with exclusive perks',
        features: ['Creator Badge', 'Promotion Priority', 'Collaboration Access'],
        image: 'fas fa-video',
        badge: 'Content',
        popular: true
    },
    {
        id: 5,
        name: 'Streamer Support Package',
        category: 'content',
        price: 24.99,
        description: 'Complete package for streamers and content creators',
        features: ['Channel Promotion', 'Viewer Boost', 'Technical Support'],
        image: 'fas fa-broadcast-tower',
        badge: 'Content',
        popular: true
    },
    {
        id: 6,
        name: 'Premium Membership',
        category: 'premium',
        price: 29.99,
        description: 'Complete premium package with all benefits',
        features: ['All Discord Perks', 'Priority Support', 'Exclusive Content'],
        image: 'fas fa-star',
        badge: 'Premium',
        popular: true
    },
    {
        id: 7,
        name: 'Mystery Box',
        category: 'premium',
        price: 12.99,
        description: 'Random premium item from our collection',
        features: ['Random Item', 'Premium Quality', 'Surprise Element'],
        image: 'fas fa-gift',
        badge: 'Premium',
        popular: false
    },
    {
        id: 8,
        name: 'Custom Server Banner',
        category: 'discord',
        price: 6.99,
        description: 'Custom banner design for your Discord server',
        features: ['Custom Design', 'High Resolution', 'Multiple Formats'],
        image: 'fas fa-image',
        badge: 'Discord',
        popular: false
    },
    {
        id: 9,
        name: 'Gaming Tournament Entry',
        category: 'gaming',
        price: 19.99,
        description: 'Entry to exclusive gaming tournaments with prizes',
        features: ['Tournament Access', 'Prize Pool', 'Live Streaming'],
        image: 'fas fa-gamepad',
        badge: 'Gaming',
        popular: true
    },
    {
        id: 10,
        name: 'Achievement Badge',
        category: 'gaming',
        price: 7.99,
        description: 'Custom achievement badge for your profile',
        features: ['Custom Design', 'Profile Display', 'Exclusive Status'],
        image: 'fas fa-trophy',
        badge: 'Gaming',
        popular: false
    },
    {
        id: 11,
        name: 'Community Manager Role',
        category: 'discord',
        price: 34.99,
        description: 'Advanced role with moderation and management tools',
        features: ['Moderation Tools', 'Custom Commands', 'Analytics Access'],
        image: 'fas fa-shield-alt',
        badge: 'Discord',
        popular: false
    },
    {
        id: 12,
        name: 'Exclusive Event Access',
        category: 'premium',
        price: 15.99,
        description: 'Access to exclusive community events and meetups',
        features: ['Event Priority', 'Exclusive Content', 'Direct Access'],
        image: 'fas fa-calendar-alt',
        badge: 'Premium',
        popular: false
    }
];

class ShopController {
    constructor() {
        this.currentCategory = 'all';
        this.currentPage = 1;
        this.searchQuery = '';
        this.cart = [];
        this.filteredItems = [...shopItems];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderShopItems();
        this.updateCartDisplay();
        this.setupSearch();
        this.setupSorting();
    }

    setupEventListeners() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.filterByCategory(e.target.getAttribute('data-category'));
            });
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-buy')) {
                const itemId = parseInt(e.target.closest('.shop-item').getAttribute('data-id'));
                this.addToCart(itemId);
            }
        });

        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                this.toggleCart();
            });
        }

        const cartClose = document.getElementById('cart-close');
        if (cartClose) {
            cartClose.addEventListener('click', () => {
                this.toggleCart();
            });
        }

        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.checkout();
            });
        }

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-btn')) {
                const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
                const action = e.target.getAttribute('data-action');
                if (action === 'increase') {
                    this.updateCartQuantity(itemId, 1);
                } else if (action === 'decrease') {
                    this.updateCartQuantity(itemId, -1);
                }
            }
            
            if (e.target.classList.contains('cart-item-remove')) {
                const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
                this.removeFromCart(itemId);
            }
        });


    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;
        
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.applyFilters();
    }

    setupSearch() {
        const searchInput = document.querySelector('.shop-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        this.filteredItems = shopItems.filter(item => {
            const matchesCategory = this.currentCategory === 'all' || item.category === this.currentCategory;
            const matchesSearch = item.name.toLowerCase().includes(this.searchQuery) || 
                                item.description.toLowerCase().includes(this.searchQuery);
            return matchesCategory && matchesSearch;
        });

        this.renderShopItems();
        this.updateItemCount();
    }

    setupSorting() {
        const sortSelect = document.querySelector('.shop-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortItems(e.target.value);
            });
        }
    }

    sortItems(sortBy) {
        switch (sortBy) {
            case 'price-low':
                this.filteredItems.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredItems.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                this.filteredItems.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'popular':
                this.filteredItems.sort((a, b) => b.popular - a.popular);
                break;
            default:
                this.filteredItems.sort((a, b) => a.id - b.id);
        }
        
        this.renderShopItems();
    }

    renderShopItems() {
        const shopGrid = document.getElementById('shop-grid');
        if (!shopGrid) return;

        shopGrid.innerHTML = '';

        const startIndex = (this.currentPage - 1) * SHOP_CONFIG.itemsPerPage;
        const endIndex = startIndex + SHOP_CONFIG.itemsPerPage;
        const itemsToShow = this.filteredItems.slice(startIndex, endIndex);

        itemsToShow.forEach((item, index) => {
            const itemElement = this.createShopItem(item, startIndex + index);
            shopGrid.appendChild(itemElement);
        });

        setTimeout(() => {
            const items = shopGrid.querySelectorAll('.shop-item');
            items.forEach((item, index) => {
                item.style.animationDelay = `${index * 100}ms`;
                item.classList.add('fade-in');
            });
        }, 100);

        this.renderPagination();
    }

    createShopItem(item, index) {
        const itemElement = document.createElement('div');
        itemElement.className = 'shop-item';
        itemElement.setAttribute('data-id', item.id);
        itemElement.setAttribute('data-category', item.category);
        itemElement.style.animationDelay = `${index * 100}ms`;

        itemElement.innerHTML = `
            <div class="item-card ${item.popular ? 'popular' : ''}">
                <div class="item-image">
                    <i class="${item.image}"></i>
                    <div class="item-badge">${item.badge}</div>
                    ${item.popular ? '<div class="popular-badge">Popular</div>' : ''}
                </div>
                <div class="item-content">
                    <h3 class="item-title">${item.name}</h3>
                    <p class="item-description">${item.description}</p>
                    <div class="item-features">
                        ${item.features.map(feature => `<span class="feature">${feature}</span>`).join('')}
                    </div>
                    <div class="item-price">
                        <span class="price">$${item.price.toFixed(2)}</span>
                        <button class="btn-buy" data-item-id="${item.id}">
                            <i class="fas fa-shopping-cart"></i>
                            Purchase
                        </button>
                    </div>
                </div>
            </div>
        `;

        return itemElement;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredItems.length / SHOP_CONFIG.itemsPerPage);
        const paginationContainer = document.querySelector('.shop-pagination');
        
        if (!paginationContainer || totalPages <= 1) return;

        let paginationHTML = '';
        
        paginationHTML += `
            <button class="pagination-btn ${this.currentPage === 1 ? 'disabled' : ''}" 
                    ${this.currentPage === 1 ? 'disabled' : ''} 
                    onclick="shopController.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `
                    <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                            onclick="shopController.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += '<span class="pagination-dots">...</span>';
            }
        }

        paginationHTML += `
            <button class="pagination-btn ${this.currentPage === totalPages ? 'disabled' : ''}" 
                    ${this.currentPage === totalPages ? 'disabled' : ''} 
                    onclick="shopController.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredItems.length / SHOP_CONFIG.itemsPerPage);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderShopItems();
        
        const shopSection = document.getElementById('shop');
        if (shopSection) {
            shopSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    addToCart(itemId) {
        const item = shopItems.find(item => item.id === itemId);
        if (!item) return;

        const existingItem = this.cart.find(cartItem => cartItem.id === itemId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...item,
                quantity: 1
            });
        }

        this.updateCartDisplay();
        this.showCartNotification(item);
        this.animateCartIcon();
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.updateCartDisplay();
    }

    updateCartQuantity(itemId, change) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            const newQuantity = item.quantity + change;
            if (newQuantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = newQuantity;
                this.updateCartDisplay();
            }
        }
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const totalAmount = document.getElementById('total-amount');
        const cartItems = document.getElementById('cart-items');
        
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }

        if (totalAmount) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            totalAmount.textContent = `$${total.toFixed(2)}`;
        }

        if (cartItems) {
            this.renderCartItems(cartItems);
        }
    }

    renderCartItems(container) {
        if (this.cart.length === 0) {
            container.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        const cartHTML = this.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <i class="${item.image}"></i>
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-action="decrease">-</button>
                    <span class="quantity-input">${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase">+</button>
                </div>
                <button class="cart-item-remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        container.innerHTML = cartHTML;
    }

    showCartNotification(item) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="${item.image}"></i>
                <div>
                    <h4>${item.name} added to cart!</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('bounce');
            setTimeout(() => cartIcon.classList.remove('bounce'), 500);
        }
    }

    toggleCart() {
        const cartDropdown = document.getElementById('cart-dropdown');
        if (cartDropdown) {
            cartDropdown.classList.toggle('open');
        }
    }



    updateItemCount() {
        const itemCount = document.querySelector('.item-count');
        if (itemCount) {
            itemCount.textContent = `${this.filteredItems.length} items`;
        }
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }

        this.showNotification('Redirecting to checkout...', 'info');
        
        setTimeout(() => {
            this.showNotification('Checkout completed! Thank you for your purchase.', 'success');
            this.cart = [];
            this.updateCartDisplay();
        }, 2000);
    }

    showNotification(message, type = 'info') {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.shopController = new ShopController();
});

const shopStyles = `
    .shop-search {
        width: 100%;
        max-width: 300px;
        padding: 12px 20px;
        border: 1px solid rgba(212, 168, 68, 0.2);
        border-radius: 25px;
        background: rgba(0, 0, 0, 0.3);
        color: var(--light-gray);
        font-size: 1rem;
        margin-bottom: 30px;
    }

    .shop-search:focus {
        outline: none;
        border-color: var(--primary-gold);
        box-shadow: 0 0 0 3px rgba(212, 168, 68, 0.1);
    }

    .shop-sort {
        padding: 8px 15px;
        border: 1px solid rgba(212, 168, 68, 0.2);
        border-radius: 15px;
        background: rgba(0, 0, 0, 0.3);
        color: var(--light-gray);
        font-size: 0.9rem;
        cursor: pointer;
    }

    .popular-badge {
        position: absolute;
        top: 15px;
        left: 15px;
        background: var(--red);
        color: white;
        padding: 4px 8px;
        border-radius: 10px;
        font-size: 0.7rem;
        font-weight: 600;
    }



    .cart-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--green);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    }

    .cart-notification.show {
        transform: translateX(0);
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .notification-content i {
        font-size: 1.5rem;
    }

    .shop-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 40px;
    }

    .pagination-btn {
        padding: 8px 12px;
        border: 1px solid rgba(212, 168, 68, 0.2);
        background: rgba(0, 0, 0, 0.3);
        color: var(--light-gray);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .pagination-btn:hover:not(.disabled) {
        background: var(--primary-gold);
        color: var(--black);
    }

    .pagination-btn.active {
        background: var(--primary-gold);
        color: var(--black);
    }

    .pagination-btn.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .pagination-dots {
        color: var(--brown-lighter);
        padding: 0 5px;
    }

    .item-count {
        text-align: center;
        color: var(--brown-lighter);
        margin-bottom: 20px;
        font-size: 0.9rem;
    }

    .cart-bounce {
        animation: cartBounce 0.5s ease;
    }

    @keyframes cartBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;

const shopStyleSheet = document.createElement('style');
shopStyleSheet.textContent = shopStyles;
document.head.appendChild(shopStyleSheet);

document.addEventListener('DOMContentLoaded', function() {
    const shopController = new ShopController();
    shopController.init();
}); 