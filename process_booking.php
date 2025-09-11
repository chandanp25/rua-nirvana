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

// Function to validate date
function isValidDate($date) {
    $d = DateTime::createFromFormat('Y-m-d', $date);
    return $d && $d->format('Y-m-d') === $date;
}

try {
    // Get and validate form data
    $fullName = isset($_POST['fullName']) ? sanitizeInput($_POST['fullName']) : '';
    $mobileNumber = isset($_POST['mobileNumber']) ? sanitizeInput($_POST['mobileNumber']) : '';
    $emailAddress = isset($_POST['emailAddress']) ? sanitizeInput($_POST['emailAddress']) : '';
    $visitDate = isset($_POST['visitDate']) ? sanitizeInput($_POST['visitDate']) : '';
    $purpose = isset($_POST['purpose']) ? sanitizeInput($_POST['purpose']) : '';
    
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
    
    if (empty($visitDate)) {
        $errors[] = 'Visit date is required';
    } elseif (!isValidDate($visitDate)) {
        $errors[] = 'Please enter a valid visit date';
    } else {
        // Check if date is not in the past
        $selectedDate = new DateTime($visitDate);
        $today = new DateTime();
        $today->setTime(0, 0, 0);
        
        if ($selectedDate < $today) {
            $errors[] = 'Visit date cannot be in the past';
        }
    }
    
    if (empty($purpose)) {
        $errors[] = 'Purpose of visit is required';
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
    $bookingData = [
        'fullName' => $fullName,
        'mobileNumber' => $mobileNumber,
        'emailAddress' => $emailAddress,
        'visitDate' => $visitDate,
        'purpose' => $purpose,
        'submittedAt' => date('Y-m-d H:i:s'),
        'ipAddress' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown'
    ];
    
    // Optional: Store in database (uncomment if you have a database)
    /*
    $db = new PDO('mysql:host=localhost;dbname=your_database', 'username', 'password');
    $stmt = $db->prepare('INSERT INTO site_visits (full_name, mobile_number, email_address, visit_date, purpose, submitted_at, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $bookingData['fullName'],
        $bookingData['mobileNumber'],
        $bookingData['emailAddress'],
        $bookingData['visitDate'],
        $bookingData['purpose'],
        $bookingData['submittedAt'],
        $bookingData['ipAddress']
    ]);
    */
    
    // Send email notification to admin
    $adminEmail = 'trayaventures@gmail.com';
    $subject = 'New Site Visit Booking - Rua Nirvana';
    
    $emailBody = "
    New Site Visit Booking Request
    
    Full Name: {$bookingData['fullName']}
    Mobile Number: {$bookingData['mobileNumber']}
    Email Address: " . ($bookingData['emailAddress'] ?: 'Not provided') . "
    Preferred Visit Date: {$bookingData['visitDate']}
    Purpose of Visit: {$bookingData['purpose']}
    
    Submitted on: {$bookingData['submittedAt']}
    IP Address: {$bookingData['ipAddress']}
    
    ---
    This is an automated message from the Rua Nirvana website.
    ";
    
    // Use Hostinger's mail function
    $headers = "From: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n";
    $headers .= "Reply-To: " . ($bookingData['emailAddress'] ?: 'noreply@' . $_SERVER['HTTP_HOST']) . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    
    // Send email
    $emailSent = mail($adminEmail, $subject, $emailBody, $headers);
    
    // Optional: Send confirmation email to user if email is provided
    if (!empty($emailAddress)) {
        $userSubject = 'Site Visit Booking Confirmation - Rua Nirvana';
        $userBody = "
        Dear {$bookingData['fullName']},
        
        Thank you for booking a site visit to Rua Nirvana!
        
        Your booking details:
        - Visit Date: {$bookingData['visitDate']}
        - Purpose: {$bookingData['purpose']}
        
        Our team will contact you at {$bookingData['mobileNumber']} within 24 hours to confirm your visit and provide further details.
        
        If you have any questions, please don't hesitate to contact us.
        
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
    
    // Log the booking (optional)
    $logEntry = date('Y-m-d H:i:s') . " - New booking from {$fullName} for {$visitDate}\n";
    file_put_contents('bookings.log', $logEntry, FILE_APPEND | LOCK_EX);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Your site visit has been booked successfully! We will contact you soon to confirm the details.',
        'data' => [
            'bookingId' => uniqid('BV'),
            'visitDate' => $visitDate
        ]
    ]);
    
} catch (Exception $e) {
    // Log error
    error_log('Booking error: ' . $e->getMessage());
    
    // Return error response
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while processing your booking. Please try again or contact us directly.'
    ]);
}
?>
