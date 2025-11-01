// Cart functionality
let cart = JSON.parse(localStorage.getItem('artify-cart')) || [];

// DOM Elements
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElement = document.getElementById('cart-count');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');

// Display cart items
function displayCartItems() {
    // Update cart count in header
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <p>Your cart is empty</p>
                <a href="index.html#products" class="btn-primary">Continue Shopping</a>
            </div>
        `;
        updateCartSummary();
        return;
    }

    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title}</h3>
                <p class="cart-item-description">${item.description}</p>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
                <button class="remove-item" data-index="${index}">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromCart(index);
        });
    });
    
    updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + item.price, 0);
    const total = subtotal; // Free shipping
    
    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
    
    // Update cart count in header
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
    
    // Save cart to localStorage
    localStorage.setItem('artify-cart', JSON.stringify(cart));
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    displayCartItems();
    // Update cart count in localStorage
    localStorage.setItem('artify-cart', JSON.stringify(cart));
}

// Customer information
let customerInfo = JSON.parse(localStorage.getItem('customer-info')) || {};

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Show customer info modal
    showCustomerInfoModal();
}

// Show customer information modal
function showCustomerInfoModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('customer-info-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'customer-info-modal';
        modal.className = 'customer-info-modal';
        modal.innerHTML = `
            <div class="customer-info-modal-content">
                <span class="customer-info-modal-close">&times;</span>
                <h2>Enter Your Information</h2>
                <form id="customer-info-form">
                    <div class="form-group">
                        <label for="customer-name">Full Name *</label>
                        <input type="text" id="customer-name" name="customer-name" required>
                    </div>
                    <div class="form-group">
                        <label for="customer-phone">Phone Number *</label>
                        <input type="tel" id="customer-phone" name="customer-phone" required>
                    </div>
                    <div class="form-group">
                        <label for="customer-email">Email Address *</label>
                        <input type="email" id="customer-email" name="customer-email" required>
                    </div>
                    <div class="form-group">
                        <label for="customer-location">Location/Address *</label>
                        <textarea id="customer-location" name="customer-location" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="order-notes">Order Notes (Optional)</label>
                        <textarea id="order-notes" name="order-notes" rows="2"></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Place Order</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Close modal when clicking on X or outside the form
        modal.querySelector('.customer-info-modal-close').addEventListener('click', closeCustomerInfoModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeCustomerInfoModal();
            }
        });
        
        // Handle form submission
        document.getElementById('customer-info-form').addEventListener('submit', handleCustomerInfoSubmit);
    }
    
    // Pre-fill form with existing info if available
    if (customerInfo.name) document.getElementById('customer-name').value = customerInfo.name;
    if (customerInfo.phone) document.getElementById('customer-phone').value = customerInfo.phone;
    if (customerInfo.email) document.getElementById('customer-email').value = customerInfo.email;
    if (customerInfo.location) document.getElementById('customer-location').value = customerInfo.location;
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close customer info modal
function closeCustomerInfoModal() {
    const modal = document.getElementById('customer-info-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Handle customer info form submission
function handleCustomerInfoSubmit(e) {
    e.preventDefault();
    
    // Get form values
    customerInfo = {
        name: document.getElementById('customer-name').value,
        phone: document.getElementById('customer-phone').value,
        email: document.getElementById('customer-email').value,
        location: document.getElementById('customer-location').value,
        notes: document.getElementById('order-notes').value
    };
    
    // Save to localStorage
    localStorage.setItem('customer-info', JSON.stringify(customerInfo));
    
    // Close modal and process order
    closeCustomerInfoModal();
    processOrder();
}

// Process order (without PayPal)
function processOrder() {
    // Send customer information to your server
    sendCustomerInfoToServer();
    
    // Redirect to success page
    window.location.href = 'success.html';
}

// Send customer information to your server
function sendCustomerInfoToServer() {
    // Create a FormData object
    const formData = new FormData();
    
    // Add customer information
    formData.append('name', customerInfo.name);
    formData.append('phone', customerInfo.phone);
    formData.append('email', customerInfo.email);
    formData.append('location', customerInfo.location);
    formData.append('notes', customerInfo.notes);
    
    // Add cart items
    cart.forEach((item, index) => {
        formData.append(`item_${index}_id`, item.id);
        formData.append(`item_${index}_title`, item.title);
        formData.append(`item_${index}_price`, item.price);
        formData.append(`item_${index}_description`, item.description);
    });
    
    // Send data to your server
    fetch('save_order.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            console.log('Customer information sent to server successfully');
            // Clear cart and customer info after successful submission
            cart = [];
            customerInfo = {};
            localStorage.removeItem('artify-cart');
            localStorage.removeItem('customer-info');
            
            // Update cart count in header
            if (cartCountElement) {
                cartCountElement.textContent = '0';
            }
        } else {
            console.error('Failed to send customer information to server');
        }
    })
    .catch(error => {
        console.error('Error sending customer information to server:', error);
    });
}

// Event listeners
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkout);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
});