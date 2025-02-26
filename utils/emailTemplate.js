export const resetPasswordTemplate = (resetUrl) => `
<!DOCTYPE html>
<html lang="en">
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
                <div class="card shadow-lg border-0">
                    <div class="card-body text-center">
                        <h2 class="card-title text-danger">Password Reset Request</h2>
                        <p class="card-text">Hello,</p>
                        <p class="text-muted">You recently requested to reset your password. Click the button below to proceed:</p>
                        <a href="${resetUrl}" class="btn btn-danger btn-lg fw-bold my-3">Reset Password</a>
                        <p class="small text-muted">If you did not request this, please ignore this email. This link will expire in 1 hour.</p>
                        <hr>
                        <p class="text-muted">&copy; 2025 EDAP. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;

export const confirmationTemplate = (confirmUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Confirm Your Email</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body class="bg-light">
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow-lg border-0">
                    <div class="card-body text-center">
                        <h2 class="card-title text-success">Confirm Your Email</h2>
                        <p class="text-muted">Thank you for registering! Please click the button below to confirm your email address:</p>
                        <a href="${confirmUrl}" class="btn btn-success btn-lg fw-bold my-3">Confirm Email</a>
                        <p class="small text-muted">If you did not create an account, please ignore this email.</p>
                        <hr>
                        <p class="text-muted">&copy; 2025 EDAP. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;
