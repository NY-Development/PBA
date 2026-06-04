export const verificationEmailTemplate = (otp) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Email</title>
</head>

<body style="margin:0; padding:0; background:#f4f6fb; font-family:Arial, sans-serif;">

  <div style="max-width:600px; margin:0 auto; padding:20px;">

    <!-- Card -->
    <div style="
      background:#ffffff;
      border-radius:16px;
      overflow:hidden;
      box-shadow:0 10px 30px rgba(0,0,0,0.08);
    ">

      <!-- Header -->
      <div style="
        background:linear-gradient(135deg,#667eea,#764ba2);
        padding:30px;
        text-align:center;
        color:white;
      ">
        <div style="font-size:40px;">🔐</div>
        <h1 style="margin:10px 0 0; font-size:22px;">Verify your email</h1>
        <p style="margin:5px 0 0; font-size:14px; opacity:0.9;">
          Secure your account in seconds
        </p>
      </div>

      <!-- Body -->
      <div style="padding:30px; text-align:center;">

        <p style="color:#555; font-size:15px; margin-bottom:20px;">
          Use this verification code to complete your registration
        </p>

        <!-- OTP Box -->
        <div style="
          display:inline-block;
          padding:18px 28px;
          font-size:34px;
          letter-spacing:10px;
          font-weight:bold;
          color:#333;
          background:#f1f3f9;
          border-radius:12px;
          border:1px dashed #ccc;
        ">
          ${otp}
        </div>

        <p style="margin-top:20px; font-size:13px; color:#888;">
          This code will expire in <strong>10 minutes</strong>
        </p>

        <!-- Button style hint (optional future use) -->
        <div style="margin-top:25px;">
          <p style="font-size:12px; color:#aaa;">
            Didn’t request this? You can safely ignore this email.
          </p>
        </div>

      </div>

      <!-- Footer -->
      <div style="
        background:#fafafa;
        text-align:center;
        padding:15px;
        font-size:11px;
        color:#999;
      ">
        © ${new Date().getFullYear()} PBA. All rights reserved.
      </div>

    </div>
  </div>

</body>
</html>
`;
};