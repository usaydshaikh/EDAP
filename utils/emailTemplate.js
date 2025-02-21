export const resetPasswordTemplate = (resetUrl) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Password Reset Request</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body class="bg-light">
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow-lg">
                    <div class="card-body text-center">
                        <h2 class="card-title text-primary">Password Reset Request</h2>
                        <p class="card-text">Hello,</p>
                        <p>You recently requested to reset your password for your account. Click the button below to reset it:</p>
                        <a href="${resetUrl}" class="btn btn-primary btn-lg">Reset Password</a>
                        <p class="mt-3">If you did not request this, please ignore this email. This link will expire in 1 hour.</p>
                        <hr>
                        <p class="text-muted">© 2025 EDAP. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;
