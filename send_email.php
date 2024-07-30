<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $screenshot = $_POST['screenshot'];

    $to = 'maximbark@gmail.com';
    $subject = 'Design Screenshot Submission';
    $message = "Name: $name\nEmail: $email\n\n";
    $message .= "Attached Screenshot:\n$screenshot";

    $headers = "From: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Send email
    mail($to, $subject, $message, $headers);

    echo 'Thank you! Your design has been submitted.';
}
?>
