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

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Redirect to PayPal checkout
    processPayment();
}

// Process payment via PayPal
function processPayment() {
    const subtotal = cart.reduce((total, item) => total + item.price, 0);
    
    // Create form for PayPal checkout
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://www.paypal.com/cgi-bin/webscr';
    
    // Add PayPal required fields
    const cmdInput = document.createElement('input');
    cmdInput.type = 'hidden';
    cmdInput.name = 'cmd';
    cmdInput.value = '_xclick';
    form.appendChild(cmdInput);
    
    const businessInput = document.createElement('input');
    businessInput.type = 'hidden';
    businessInput.name = 'business';
    businessInput.value = 'nora.atroshy@gmail.com'; // Replace with your PayPal email
    form.appendChild(businessInput);
    
    const item_nameInput = document.createElement('input');
    item_nameInput.type = 'hidden';
    item_nameInput.name = 'item_name';
    item_nameInput.value = 'Art Supplies Order';
    form.appendChild(item_nameInput);
    
    const amountInput = document.createElement('input');
    amountInput.type = 'hidden';
    amountInput.name = 'amount';
    amountInput.value = subtotal.toFixed(2);
    form.appendChild(amountInput);
    
    const currencyInput = document.createElement('input');
    currencyInput.type = 'hidden';
    currencyInput.name = 'currency_code';
    currencyInput.value = 'USD';
    form.appendChild(currencyInput);
    
    // Use relative paths for return URLs
    const returnInput = document.createElement('input');
    returnInput.type = 'hidden';
    returnInput.name = 'return';
    returnInput.value = 'success.html';
    form.appendChild(returnInput);
    
    const cancelReturnInput = document.createElement('input');
    cancelReturnInput.type = 'hidden';
    cancelReturnInput.name = 'cancel_return';
    cancelReturnInput.value = 'cancel.html';
    form.appendChild(cancelReturnInput);
    
    const notifyUrlInput = document.createElement('input');
    notifyUrlInput.type = 'hidden';
    notifyUrlInput.name = 'notify_url';
    notifyUrlInput.value = 'notification.html';
    form.appendChild(notifyUrlInput);
    
    document.body.appendChild(form);
    form.submit();
    
    // Clear cart after successful redirect
    cart = [];
    localStorage.setItem('artify-cart', JSON.stringify(cart));
    
    // Update cart count in header
    if (cartCountElement) {
        cartCountElement.textContent = '0';
    }
}

// Event listeners
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkout);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
});