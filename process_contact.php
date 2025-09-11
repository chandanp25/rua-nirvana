<?php
// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Function to sanitize input data
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate email format
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Function to validate phone number
function isValidPhone($phone) {
    // Remove all non-digit characters except +, -, (, ), and space
    $cleanPhone = preg_replace('/[^0-9+\-\(\)\s]/', '', $phone);
    return strlen($cleanPhone) >= 10;
}

try {
    // Get and validate form data
    $fullName = isset($_POST['fullName']) ? sanitizeInput($_POST['fullName']) : '';
    $mobileNumber = isset($_POST['mobileNumber']) ? sanitizeInput($_POST['mobileNumber']) : '';
    $emailAddress = isset($_POST['emailAddress']) ? sanitizeInput($_POST['emailAddress']) : '';
    $message = isset($_POST['message']) ? sanitizeInput($_POST['message']) : '';
    
    // Validation
    $errors = [];
    
    if (empty($fullName)) {
        $errors[] = 'Full name is required';
    } elseif (strlen($fullName) < 2) {
        $errors[] = 'Full name must be at least 2 characters long';
    }
    
    if (empty($mobileNumber)) {
        $errors[] = 'Mobile number is required';
    } elseif (!isValidPhone($mobileNumber)) {
        $errors[] = 'Please enter a valid mobile number';
    }
    
    if (!empty($emailAddress) && !isValidEmail($emailAddress)) {
        $errors[] = 'Please enter a valid email address';
    }
    
    if (empty($message)) {
        $errors[] = 'Message is required';
    } elseif (strlen($message) < 10) {
        $errors[] = 'Message must be at least 10 characters long';
    }
    
    
    // If there are validation errors, return them
    if (!empty($errors)) {
        echo json_encode([
            'success' => false,
            'message' => 'Please correct the following errors: ' . implode(', ', $errors)
        ]);
        exit;
    }
    
    // Prepare data for storage/email
    $contactData = [
        'fullName' => $fullName,
        'mobileNumber' => $mobileNumber,
        'emailAddress' => $emailAddress,
        'message' => $message,
        'submittedAt' => date('Y-m-d H:i:s'),
        'ipAddress' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown'
    ];
    
    // Optional: Store in database (uncomment if you have a database)
    /*
    $db = new PDO('mysql:host=localhost;dbname=your_database', 'username', 'password');
    $stmt = $db->prepare('INSERT INTO contact_messages (full_name, mobile_number, email_address, message, submitted_at, ip_address) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $contactData['fullName'],
        $contactData['mobileNumber'],
        $contactData['emailAddress'],
        $contactData['message'],
        $contactData['submittedAt'],
        $contactData['ipAddress']
    ]);
    */
    
    // Send email notification to admin
    $adminEmail = 'trayaventures@gmail.com';
    $subject = 'New Contact Message - Rua Nirvana';
    
    $emailBody = "
    New Contact Message Received
    
    Full Name: {$contactData['fullName']}
    Mobile Number: {$contactData['mobileNumber']}
    Email Address: " . ($contactData['emailAddress'] ?: 'Not provided') . "
    Message: {$contactData['message']}
    
    Submitted on: {$contactData['submittedAt']}
    IP Address: {$contactData['ipAddress']}
    
    ---
    This is an automated message from the Rua Nirvana website.
    ";
    
    // Use Hostinger's mail function
    $headers = "From: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n";
    $headers .= "Reply-To: " . ($contactData['emailAddress'] ?: 'noreply@' . $_SERVER['HTTP_HOST']) . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    
    // Send email
    $emailSent = mail($adminEmail, $subject, $emailBody, $headers);
    
    // Optional: Send confirmation email to user if email is provided
    if (!empty($emailAddress)) {
        $userSubject = 'Message Received - Rua Nirvana';
        $userBody = "
        Dear {$contactData['fullName']},
        
        Thank you for contacting Rua Nirvana!
        
        We have received your message and will get back to you soon using your preferred contact method: {$contactData['contactMethods']}
        
        Your message:
        \"{$contactData['message']}\"
        
        If you have any urgent questions, please don't hesitate to call us directly.
        
        Best regards,
        The Rua Nirvana Team
        
        ---
        This is an automated confirmation email.
        ";
        
        $userHeaders = [
            'From: noreply@ruanirvana.com',
            'Content-Type: text/plain; charset=UTF-8',
            'X-Mailer: PHP/' . phpversion()
        ];
        
        mail($emailAddress, $userSubject, $userBody, implode("\r\n", $userHeaders));
    }
    
    // Log the contact message (optional)
    $logEntry = date('Y-m-d H:i:s') . " - New contact message from {$fullName}\n";
    file_put_contents('contact_messages.log', $logEntry, FILE_APPEND | LOCK_EX);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Your message has been sent successfully! We will get back to you soon.',
        'data' => [
            'messageId' => uniqid('CM'),
            'contactMethods' => $contactMethods
        ]
    ]);
    
} catch (Exception $e) {
    // Log error
    error_log('Contact form error: ' . $e->getMessage());
    
    // Return error response
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while sending your message. Please try again or contact us directly.'
    ]);
}
?>
