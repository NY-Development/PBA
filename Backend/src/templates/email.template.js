
// ==============================
// BASE EMAIL TEMPLATE
// ==============================

export const baseEmailTemplate = ({
  // BRANDING
  appName = "PBA",
  logo = "",
  companyUrl = "",

  // HEADER
  headerIcon = "📩",
  title = "Notification",
  subtitle = "",

  // CONTENT
  greeting = "",
  message = "",

  // HIGHLIGHT BOX
  highlightContent = "",
  alertType = "info", // success | error | warning | info

  // LISTS
  listItems = [],

  // BUTTON
  buttonText = "",
  buttonUrl = "",

  // EXTRA SECTION
  customSection = "",

  // SUPPORT
  supportText = "",
  supportEmail = "",

  // FOOTER
  footerText = "All rights reserved.",

  // COLORS
  gradient = "linear-gradient(135deg,#667eea,#764ba2)",
  buttonColor = "#667eea",
}) => {

  // ALERT COLORS
  const alertColors = {
    success: {
      bg: "#ecfdf3",
      border: "#12b76a",
      text: "#027a48",
    },

    error: {
      bg: "#fef3f2",
      border: "#f04438",
      text: "#b42318",
    },

    warning: {
      bg: "#fffaeb",
      border: "#f79009",
      text: "#b54708",
    },

    info: {
      bg: "#eff8ff",
      border: "#2e90fa",
      text: "#175cd3",
    },
  };

  const selectedAlert =
    alertColors[alertType] || alertColors.info;

  return `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8" />
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<title>${title}</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f4f6fb;
  font-family:Arial,sans-serif;
">

  <div style="
    width:100%;
    padding:30px 15px;
    box-sizing:border-box;
  ">

    <!-- EMAIL CONTAINER -->
    <div style="
      max-width:600px;
      margin:0 auto;
      background:#ffffff;
      border-radius:18px;
      overflow:hidden;
      box-shadow:0 10px 35px rgba(0,0,0,0.08);
    ">

      <!-- HEADER -->
      <div style="
        background:${gradient};
        padding:40px 25px;
        text-align:center;
        color:#ffffff;
      ">

        ${
          logo
            ? `
          <a
            href="${companyUrl}"
            target="_blank"
            style="text-decoration:none;"
          >
            <img
              src="${logo}"
              alt="${appName}"
              style="
                width:75px;
                height:75px;
                object-fit:contain;
                margin-bottom:15px;
              "
            />
          </a>
        `
            : ""
        }

        <div style="
          font-size:42px;
          margin-bottom:10px;
        ">
          ${headerIcon}
        </div>

        <h1 style="
          margin:0 0 10px;
          font-size:28px;
          line-height:1.4;
          font-weight:700;
        ">
          ${title}
        </h1>

        ${
          subtitle
            ? `
          <p style="
            margin:0;
            font-size:14px;
            line-height:1.6;
            opacity:0.92;
          ">
            ${subtitle}
          </p>
        `
            : ""
        }

      </div>

      <!-- BODY -->
      <div style="
        padding:35px 30px;
        color:#444;
      ">

        ${
          greeting
            ? `
          <p style="
            margin-top:0;
            margin-bottom:20px;
            font-size:16px;
            font-weight:bold;
            color:#222;
          ">
            ${greeting}
          </p>
        `
            : ""
        }

        ${
          message
            ? `
          <p style="
            margin-top:0;
            margin-bottom:25px;
            font-size:15px;
            line-height:1.8;
            color:#555;
          ">
            ${message}
          </p>
        `
            : ""
        }

        <!-- HIGHLIGHT -->
        ${
          highlightContent
            ? `
          <div style="
            margin:25px 0;
            padding:18px 20px;
            border-left:5px solid ${selectedAlert.border};
            background:${selectedAlert.bg};
            color:${selectedAlert.text};
            border-radius:10px;
            font-size:14px;
            line-height:1.7;
          ">
            ${highlightContent}
          </div>
        `
            : ""
        }

        <!-- LIST ITEMS -->
        ${
          listItems.length
            ? `
          <div style="margin:25px 0;">
            <ul style="
              margin:0;
              padding-left:22px;
              color:#555;
            ">
              ${listItems
                .map(
                  item => `
                <li style="
                  margin-bottom:10px;
                  line-height:1.7;
                  font-size:15px;
                ">
                  ${item}
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        `
            : ""
        }

        <!-- BUTTON -->
        ${
          buttonText && buttonUrl
            ? `
          <div style="
            text-align:center;
            margin:35px 0 10px;
          ">
            <a
              href="${buttonUrl}"
              target="_blank"
              style="
                display:inline-block;
                background:${buttonColor};
                color:#ffffff;
                text-decoration:none;
                padding:14px 30px;
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

        <!-- CUSTOM SECTION -->
        ${customSection}

        <!-- SUPPORT -->
        ${
          supportText || supportEmail
            ? `
          <div style="
            margin-top:35px;
            padding-top:20px;
            border-top:1px solid #eeeeee;
            font-size:13px;
            line-height:1.7;
            color:#777;
          ">

            ${
              supportText
                ? `
              <div>
                ${supportText}
              </div>
            `
                : ""
            }

            ${
              supportEmail
                ? `
              <div style="margin-top:8px;">
                Support:
                <a
                  href="mailto:${supportEmail}"
                  style="
                    color:${buttonColor};
                    text-decoration:none;
                  "
                >
                  ${supportEmail}
                </a>
              </div>
            `
                : ""
            }

          </div>
        `
            : ""
        }

      </div>

      <!-- FOOTER -->
      <div style="
        background:#fafafa;
        padding:18px;
        text-align:center;
        font-size:12px;
        color:#999999;
        border-top:1px solid #eeeeee;
      ">

        © ${new Date().getFullYear()}
        ${appName}.
        ${footerText}

      </div>

    </div>

  </div>

</body>
</html>
`;
};