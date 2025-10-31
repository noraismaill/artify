#  artify - E-commerce Website

A beautiful, responsive e-commerce website for selling art supplies with integrated PayPal payment processing.

## Features

- Responsive design that works on all devices
- Product showcase with images and descriptions
- Shopping cart functionality
- PayPal "Buy Now" buttons for instant purchases
- Order confirmation and cancellation pages
- Contact form for customer inquiries

## Files Included

- `index.html` - Main homepage with product listings
- `cart.html` - Shopping cart page
- `success.html` - Order confirmation page
- `cancel.html` - Order cancellation page
- `notification.html` - Payment notification information
- `styles.css` - All styling for the website
- `script.js` - JavaScript for homepage functionality
- `cart.js` - JavaScript for cart functionality

## Setup Instructions

### 1. PayPal Configuration

To start accepting real payments, you need to:

1. Create a PayPal Business account at https://www.paypal.com/business
2. Replace `YOUR_PAYPAL_BUSINESS_EMAIL_HERE` in `script.js` with your actual PayPal business email
3. Update the `return` and `cancel_return` URLs in the PayPal form to point to your actual domain

### 2. Hosting Your Website

Since this is a static website (HTML, CSS, JavaScript only), you can host it on any web hosting service:

- Upload all files to your web server
- Make sure all files are in the same directory
- Access your site through your domain

### 3. Testing Payments

Before going live:
1. Test the PayPal buttons using PayPal's sandbox environment
2. Create test accounts in your PayPal developer dashboard
3. Ensure all links work correctly

## How It Works

### For Customers
1. Browse products on the homepage
2. Click "Buy Now with PayPal" to purchase immediately
3. Complete payment through PayPal
4. Receive confirmation on success page

### For You (Business Owner)
1. Receive payments directly in your PayPal account
2. Get email notifications from PayPal for each transaction
3. Fulfill orders manually based on PayPal transaction details

## Customization

### Adding New Products
1. Edit `script.js`
2. Add new objects to the `products` array with:
   - id (unique number)
   - title (product name)
   - description (product details)
   - price (numeric value)
   - image (URL to product image)

### Changing Styles
1. Edit `styles.css` to modify colors, fonts, spacing
2. All styles are organized by section for easy editing

### Updating Contact Information
1. Edit `index.html` and other HTML files
2. Update contact details in the footer and contact section

## Limitations

This is a frontend-only solution with the following limitations:
- No automatic inventory management
- No automatic order tracking
- No customer account system
- No automatic email notifications
- Manual order fulfillment required

## Next Steps for Advanced Features

To add more advanced e-commerce features, consider:
- Setting up PayPal IPN (Instant Payment Notification) for automated order processing
- Adding a backend server (Node.js, PHP, etc.) for inventory management
- Integrating a database for customer accounts and order history
- Adding shipping calculation and tax features

## Support

For questions about setting up or customizing your website, please contact:
your-email@example.com

For PayPal integration issues, refer to:
https://developer.paypal.com/docs/classic/paypal-payments-standard/integration-guide/formbasics/

## License

This website template is provided for personal and commercial use with no restrictions. You may modify it as needed for your business.
