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