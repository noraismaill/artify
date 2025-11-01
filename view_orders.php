<?php
// view_orders.php - Simple page to view orders from database

// Include database configuration
require_once 'db_config.php';

// Set password for accessing orders (change this to something secure)
define('ACCESS_PASSWORD', 'artify123');

// Check if password is provided
if (!isset($_POST['password']) || $_POST['password'] !== ACCESS_PASSWORD) {
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>View Orders - Artify</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .login-form {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                text-align: center;
                margin-top: 50px;
            }
            input[type="password"] {
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 5px;
                width: 250px;
                margin: 10px;
                font-size: 16px;
            }
            button {
                background: #3498db;
                color: white;
                padding: 12px 30px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                margin: 10px;
            }
            button:hover {
                background: #2980b9;
            }
            h1 {
                color: #2c3e50;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <h1>Artify Orders</h1>
        <div class="login-form">
            <h2>Enter Password to View Orders</h2>
            <form method="POST">
                <input type="password" name="password" placeholder="Enter password" required>
                <br>
                <button type="submit">View Orders</button>
            </form>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// If password is correct, show orders
// Connect to database
$conn = getDbConnection();

// Retrieve orders from database
$sql = "SELECT * FROM orders ORDER BY order_date DESC";
$result = $conn->query($sql);

$orders = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Parse the items JSON
        $items = json_decode($row['items'], true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $items = []; // Default to empty array if JSON is invalid
        }
        
        $orders[] = [
            'id' => $row['id'],
            'order_date' => $row['order_date'],
            'customer' => [
                'name' => $row['customer_name'],
                'phone' => $row['customer_phone'],
                'email' => $row['customer_email'],
                'location' => $row['customer_location'],
                'notes' => $row['customer_notes']
            ],
            'items' => $items
        ];
    }
}

// Close connection
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orders - Artify</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        h1 {
            color: #2c3e50;
        }
        .logout-btn {
            background: #e74c3c;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
        }
        .logout-btn:hover {
            background: #c0392b;
        }
        .order {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.08);
        }
        .order-header {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
            margin-bottom: 15px;
        }
        .customer-info {
            margin-bottom: 20px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .items-table th, .items-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        .items-table th {
            background-color: #f8f9fa;
        }
        .total {
            font-weight: bold;
            font-size: 1.2em;
            text-align: right;
        }
        .no-orders {
            text-align: center;
            padding: 50px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.08);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Artify Orders</h1>
        <a href="?logout=true" class="logout-btn">Logout</a>
    </div>

    <?php if (empty($orders)): ?>
        <div class="no-orders">
            <h2>No orders yet</h2>
            <p>Orders will appear here when customers place them.</p>
        </div>
    <?php else: ?>
        <?php 
        foreach ($orders as $order): 
            $total = 0;
            foreach ($order['items'] as $item) {
                $total += $item['price'];
            }
        ?>
            <div class="order">
                <div class="order-header">
                    <div>
                        <strong>Order ID:</strong> <?php echo htmlspecialchars($order['id']); ?>
                    </div>
                    <div>
                        <strong>Order Date:</strong> <?php echo htmlspecialchars($order['order_date']); ?>
                    </div>
                    <div>
                        <strong>Customer:</strong> <?php echo htmlspecialchars($order['customer']['name']); ?>
                    </div>
                </div>
                
                <div class="customer-info">
                    <p><strong>Phone:</strong> <?php echo htmlspecialchars($order['customer']['phone']); ?></p>
                    <p><strong>Email:</strong> <?php echo htmlspecialchars($order['customer']['email']); ?></p>
                    <p><strong>Location:</strong> <?php echo htmlspecialchars($order['customer']['location']); ?></p>
                    <?php if (!empty($order['customer']['notes'])): ?>
                        <p><strong>Notes:</strong> <?php echo htmlspecialchars($order['customer']['notes']); ?></p>
                    <?php endif; ?>
                </div>
                
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Description</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($order['items'] as $item): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($item['title']); ?></td>
                                <td><?php echo htmlspecialchars($item['description']); ?></td>
                                <td>$<?php echo number_format($item['price'], 2); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                
                <div class="total">
                    Total: $<?php echo number_format($total, 2); ?>
                </div>
            </div>
        <?php endforeach; ?>
    <?php endif; ?>
</body>
</html>