
// ==============================
// BASE EMAIL TEMPLATE
// ==============================

export const baseEmailTemplate = ({
  logo = "",
  headerIcon = "📩",
  title = "Notification",
  subtitle = "",
  message = "",
  highlightContent = "",
  buttonText = "",
  buttonUrl = "",
  footerText = "All rights reserved.",
  gradient = "linear-gradient(135deg,#667eea,#764ba2)",
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f4f6fb;
  font-family:Arial,sans-serif;
">

  <div style="
    max-width:600px;
    margin:0 auto;
    padding:20px;
  ">

    <!-- Card -->
    <div style="
      background:#ffffff;
      border-radius:18px;
      overflow:hidden;
      box-shadow:0 10px 35px rgba(0,0,0,0.08);
    ">

      <!-- Header -->
      <div style="
        background:${gradient};
        padding:35px 25px;
        text-align:center;
        color:white;
      ">

        ${
          logo
            ? `
          <img
            src="${logo}"
            alt="logo"
            style="
              width:70px;
              height:70px;
              object-fit:contain;
              margin-bottom:15px;
            "
          />
        `
            : ""
        }

        <div style="font-size:40px;">
          ${headerIcon}
        </div>

        <h1 style="
          margin:12px 0 6px;
          font-size:28px;
          font-weight:700;
        ">
          ${title}
        </h1>

        <p style="
          margin:0;
          font-size:14px;
          opacity:0.9;
        ">
          ${subtitle}
        </p>
      </div>

      <!-- Body -->
      <div style="
        padding:35px 30px;
        text-align:center;
      ">

        <p style="
          color:#555;
          font-size:15px;
          line-height:1.7;
          margin-bottom:25px;
        ">
          ${message}
        </p>

        ${
          highlightContent
            ? `
          <div style="
            display:inline-block;
            padding:18px 28px;
            background:#f1f3f9;
            border-radius:14px;
            border:1px dashed #cfcfcf;
            margin-bottom:25px;
          ">
            ${highlightContent}
          </div>
        `
            : ""
        }

        ${
          buttonText && buttonUrl
            ? `
          <div style="margin-top:10px;">
            <a
              href="${buttonUrl}"
              style="
                display:inline-block;
                padding:14px 28px;
                background:#667eea;
                color:white;
                text-decoration:none;
                border-radius:10px;
                font-size:14px;
                font-weight:bold;
              "
            >
              ${buttonText}
            </a>
          </div>
        `
            : ""
        }

      </div>

      <!-- Footer -->
      <div style="
        background:#fafafa;
        text-align:center;
        padding:18px;
        font-size:12px;
        color:#999;
        border-top:1px solid #eee;
      ">
        © ${new Date().getFullYear()} PBA. ${footerText}
      </div>

    </div>

  </div>

</body>
</html>
`;
};


// ==============================
// OTP VERIFICATION EMAIL
// ==============================

export const verificationEmailTemplate = (otp) => {
  return baseEmailTemplate({
    headerIcon: "🔐",
    title: "Verify Your Email",
    subtitle: "Secure your account in seconds",
    message:
      "Use the verification code below to complete your registration.",

    highlightContent: `
      <div style="
        font-size:34px;
        letter-spacing:10px;
        font-weight:bold;
        color:#333;
      ">
        ${otp}
      </div>

      <div style="
        margin-top:10px;
        font-size:13px;
        color:#888;
      ">
        This code expires in <strong>10 minutes</strong>
      </div>
    `,
  });
};


// ==============================
// PAYMENT SUCCESS EMAIL
// ==============================

export const paymentSuccessTemplate = ({
  customerName,
  amount,
  orderId,
}) => {
  return baseEmailTemplate({
    headerIcon: "✅",
    title: "Payment Successful",
    subtitle: "Your payment has been confirmed",
    gradient: "linear-gradient(135deg,#11998e,#38ef7d)",

    message: `
      Hi ${customerName}, <br/><br/>
      Your payment was processed successfully.
    `,

    highlightContent: `
      <div style="font-size:18px; color:#333;">
        <strong>Amount:</strong> ${amount}
      </div>

      <div style="
        margin-top:10px;
        font-size:14px;
        color:#666;
      ">
        Order ID: ${orderId}
      </div>
    `,
  });
};


// ==============================
// ADVERTISEMENT EMAIL
// ==============================

export const advertisementTemplate = ({
  title,
  description,
  imageUrl,
  buttonText,
  buttonUrl,
}) => {
  return baseEmailTemplate({
    headerIcon: "🔥",
    title,
    subtitle: "Special offer just for you",
    gradient: "linear-gradient(135deg,#ff9966,#ff5e62)",

    message: `
      <img
        src="${imageUrl}"
        alt="promo"
        style="
          width:100%;
          border-radius:14px;
          margin-bottom:20px;
        "
      />

      ${description}
    `,

    buttonText,
    buttonUrl,
  });
};