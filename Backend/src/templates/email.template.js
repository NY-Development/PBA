export const verificationEmailTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center;">
          <!-- Logo/Icon -->
          <div style="margin-bottom: 30px;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 40px;">🔐</span>
            </div>
          </div>
          
          <h1 style="color: #333; margin-bottom: 10px; font-size: 28px;">Email Verification</h1>
          <p style="color: #666; margin-bottom: 30px; font-size: 16px;">Use the following code to verify your email address</p>
          
          <!-- OTP Code Box -->
          <div style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
            <div style="font-size: 48px; font-weight: bold; letter-spacing: 10px; color: #333; background: white; padding: 20px; border-radius: 10px; font-family: 'Courier New', monospace;">
              ${otp}
            </div>
          </div>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              ⏰ This code expires in <strong>10 minutes</strong>
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 5px 0;">
              If you didn't request this code, please ignore this email.
            </p>
            <p style="color: #999; font-size: 12px; margin: 5px 0;">
              © 2024 Your Company. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};