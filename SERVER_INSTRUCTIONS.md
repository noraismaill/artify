# Server Setup Instructions for Artify

This document explains how to set up the server-side components for receiving and managing customer orders.

## Files Included

1. `save_order.php` - Receives customer information and saves it to a database
2. `view_orders.php` - Displays all orders with a password-protected interface
3. `db_config.php` - Database configuration file

## Database Setup

### 1. Create Database Tables

Run the following SQL to create the orders table:

```sql
CREATE DATABASE IF NOT EXISTS artify_orders;
USE artify_orders;

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_date DATETIME,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    customer_location TEXT,
    customer_notes TEXT,
    items JSON
);
```

### 2. Configure Database Connection

Update the database connection details in `db_config.php`:

```php
<?php
// Database configuration
define('DB_HOST', 'localhost');      // Change this to your database host
define('DB_USERNAME', 'root');       // Change this to your database username
define('DB_PASSWORD', '');           // Change this to your database password
define('DB_NAME', 'artify_orders');  // Change this to your database name

// Create connection
function getDbConnection() {
    $conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    return $conn;
}
?>
```

## Setup Instructions

### 1. Upload Files to Your Server

Upload the following files to your web server:
- `save_order.php`
- `view_orders.php`
- `db_config.php`

These files should be accessible via your web server.

### 2. Set Up Password for Viewing Orders

In `view_orders.php`, find this line:
```php
define('ACCESS_PASSWORD', 'artify123');
```

Change `'artify123'` to a secure password of your choice.

### 3. Configure Email Notifications (Optional)

In `save_order.php`, find this line:
```php
$to = 'nora.atroshy@gmail.com'; // Change to your email
```

Update the email address to where you want to receive order notifications.

## How It Works

1. When a customer fills out their information and clicks "Place Order":
   - The customer data is sent to `save_order.php` on your server
   - The data is saved to your database
   - An email notification is sent to your email address (if configured)

2. To view orders:
   - Navigate to `view_orders.php` on your server
   - Enter the password you set in the `ACCESS_PASSWORD` definition
   - You'll see a list of all orders with customer information and items ordered

## Security Considerations

1. Change the default password in `view_orders.php`
2. Use strong database credentials
3. Ensure your database is properly secured
4. For production use, consider implementing proper authentication instead of a simple password

## Troubleshooting

1. If orders aren't being saved:
   - Check that the database connection details are correct
   - Verify that the database table exists and has the correct structure
   - Check the browser's developer console for JavaScript errors

2. If emails aren't being sent:
   - Verify that your server supports the PHP `mail()` function
   - Check that your server is configured to send emails
   - Consider using a third-party email service like PHPMailer

3. If you can't access the orders page:
   - Ensure PHP is installed and configured correctly on your server
   - Check database connection settings
   - Verify that the database table exists