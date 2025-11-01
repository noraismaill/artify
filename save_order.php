<?php
// save_order.php - Script to receive and store order information in a database

// Include database configuration
require_once 'db_config.php';

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type to JSON
header('Content-Type: application/json');

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get the current date and time
$order_date = date('Y-m-d H:i:s');

// Collect customer information
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$location = isset($_POST['location']) ? trim($_POST['location']) : '';
$notes = isset($_POST['notes']) ? trim($_POST['notes']) : '';

// Validate required fields
if (empty($name) || empty($phone) || empty($email) || empty($location)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// Collect items
$items = [];
$item_index = 0;
while (isset($_POST["item_{$item_index}_id"])) {
    $items[] = [
        'id' => $_POST["item_{$item_index}_id"],
        'title' => $_POST["item_{$item_index}_title"],
        'price' => $_POST["item_{$item_index}_price"],
        'description' => $_POST["item_{$item_index}_description"]
    ];
    $item_index++;
}

// Create order data array
$order_data = [
    'order_date' => $order_date,
    'customer' => [
        'name' => $name,
        'phone' => $phone,
        'email' => $email,
        'location' => $location,
        'notes' => $notes
    ],
    'items' => $items
];

// Connect to database
$conn = getDbConnection();

// Prepare statement for inserting order
$stmt = $conn->prepare("INSERT INTO orders (order_date, customer_name, customer_phone, customer_email, customer_location, customer_notes, items) VALUES (?, ?, ?, ?, ?, ?, ?)");

// Convert items array to JSON for storage
$items_json = json_encode($items);

// Bind parameters
$stmt->bind_param("sssssss", $order_date, $name, $phone, $email, $location, $notes, $items_json);

// Execute statement
if ($stmt->execute()) {
    $order_id = $conn->insert_id; // Get the ID of the inserted order
    
    // Also send email notification
    $to = 'nora.atroshy@gmail.com'; // Change to your email
    $subject = 'New Order Received - Artify';
    $message = "A new order has been received:\n\n";
    $message .= "Date: $order_date\n";
    $message .= "Name: $name\n";
    $message .= "Phone: $phone\n";
    $message .= "Email: $email\n";
    $message .= "Location: $location\n";
    $message .= "Notes: $notes\n\n";
    $message .= "Items ordered:\n";
    
    foreach ($items as $item) {
        $message .= "- {$item['title']} (\${$item['price']})\n";
    }
    
    $headers = "From: noreply@artify.com\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Send email (this might not work on all servers)
    mail($to, $subject, $message, $headers);
    
    // Return success response
    echo json_encode(['success' => true, 'message' => 'Order information saved successfully', 'order_id' => $order_id]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save order information: ' . $conn->error]);
}

// Close connections
$stmt->close();
$conn->close();
?>