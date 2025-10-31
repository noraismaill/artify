// Sample product data
const products = [
    {
        id: 1,
        title: "brushes",
        description: "high quality brushes",
        price: 5.99,
        image: "brush3.jpeg"
    },
    {
        id: 2,
        title: "brushes",
        description: "creativity with unique colors",
        price: 21.99,
        image: "kidscolor.jpeg"
    },
    {
        id: 3,
        title: "canvas",
        description: "academy art supply stretched canvases 20 * 30 inch",
        price: 15.66,
        image: "canvas.jpeg"
    },
    {
        id: 4,
        title: "colors",
        description: "colors for your creativity",
        price: 18.20,
        image: "colors.jpeg"
    },
    {
        id: 5,
        title: "all art supplies that you need ",
        description: "every thing you need for your art",
        price: 49.99,
        image: "combo.jpeg"
    },
    {
        id: 6,
        title: "kids colors",
        description: "28 magical crafts you'll love",
        price: 23.40,
        image: "kidscolor.jpeg"
    }
];

// Shopping cart
let cart = JSON.parse(localStorage.getItem('artify-cart')) || [];
let cartCount = cart.length;

// DOM Elements
const productsContainer = document.getElementById('products-container');
const cartCountElement = document.getElementById('cart-count');

// Display products
function displayProducts() {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image zoom-image" style="background-image: url('${product.image}')" data-image="${product.image}"></div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
    
    // Add event listeners to product images for zoom
    document.querySelectorAll('.zoom-image').forEach(image => {
        image.addEventListener('click', function() {
            const imageUrl = this.getAttribute('data-image');
            openImageModal(imageUrl);
        });
    });
    
    // Update cart count display
    updateCartCount();
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        cartCount++;
        updateCartCount();
        
        // Save to localStorage
        localStorage.setItem('artify-cart', JSON.stringify(cart));
        
        // Show confirmation message
        alert(`${product.title} added to cart!`);
        
        // Redirect to cart page
        window.location.href = 'cart.html';
    }
}

// Update cart count display
function updateCartCount() {
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
    // Save to localStorage
    localStorage.setItem('artify-cart', JSON.stringify(cart));
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

// Handle form submission
document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;
    
    // In a real application, you would send this data to a server
    alert(`Thank you, ${name}! Your message has been sent. We'll contact you at ${email} soon.`);
    
    // Reset form
    this.reset();
});

// Image zoom modal functions
function openImageModal(imageUrl) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('image-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'image-modal';
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-modal-content">
                <span class="image-modal-close">&times;</span>
                <img src="" alt="Product Image" id="modal-image">
            </div>
        `;
        document.body.appendChild(modal);
        
        // Close modal when clicking on X or outside the image
        modal.querySelector('.image-modal-close').addEventListener('click', closeImageModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeImageModal();
            }
        });
    }
    
    // Set the image and show modal
    document.getElementById('modal-image').src = imageUrl;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeImageModal();
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    updateCartCount();
});