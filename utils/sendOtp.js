import { createTransport } from "nodemailer";

const sendOtp = async (email, subject, otp) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  //   const html = `<!DOCTYPE html>
  // <html lang="en">
  // <head>
  //     <meta charset="UTF-8">
  //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //     <title>OTP Verification</title>
  //     <style>
  //         body {
  //             font-family: Arial, sans-serif;
  //             margin: 0;
  //             padding: 0;
  //             display: flex;
  //             justify-content: center;
  //             align-items: center;
  //             height: 100vh;
  //         }
  //         .container {
  //             background-color: #fff;
  //             padding: 20px;
  //             border-radius: 8px;
  //             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  //             text-align: center;
  //         }
  //         h1 {
  //             color: red;
  //         }
  //         p {
  //             margin-bottom: 20px;
  //             color: #666;
  //         }
  //         .otp {
  //             font-size: 36px;
  //             color: #7b68ee;
  //             margin-bottom: 30px;
  //         }
  //     </style>
  // </head>
  // <body>
  //     <div class="container">
  //         <h1>OTP Verification</h1>
  //         <p>Hello ${email}, your One-Time Password for account verification is:</p>
  //         <p class="otp">${otp}</p>
  //     </div>
  // </body>
  // </html>`;

// Improvised HTML email template with better styling and structure

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>OTP Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f5f7; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">

  <!-- Preheader (inbox preview text) -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:#f4f5f7; font-size:1px; line-height:1px;">
    Your verification code is ${otp}. It is valid for 5 minutes.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f5f7" style="background-color:#f4f5f7;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- Main container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding:0 0 20px 0;">
              <img src="cid:brandlogo" width="64" height="64" alt="Logo" style="display:block; width:64px; height:64px; border:0; outline:none; text-decoration:none; border-radius:32px;" />
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td bgcolor="#ffffff" style="background-color:#ffffff; border:1px solid #e6e8ec; border-radius:12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                <!-- Accent bar -->
                <tr>
                  <td height="4" style="height:4px; line-height:4px; font-size:0; background-color:#ff5a5a; border-radius:12px 12px 0 0;">&nbsp;</td>
                </tr>

                <!-- Heading -->
                <tr>
                  <td align="center" style="padding:36px 32px 8px 32px; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
                    <h1 style="margin:0; font-size:24px; line-height:32px; font-weight:700; color:#1a1d23;">Verify your email address</h1>
                  </td>
                </tr>

                <!-- Greeting -->
                <tr>
                  <td align="center" style="padding:8px 32px 24px 32px; font-family:'Segoe UI', Helvetica, Arial, sans-serif; font-size:15px; line-height:24px; color:#5b6270;">
                    Hello <strong style="color:#1a1d23;">${email}</strong>,<br />
                    use the one-time password below to complete your account verification.
                  </td>
                </tr>

                <!-- OTP block -->
                <tr>
                  <td align="center" style="padding:0 32px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td align="center" bgcolor="#fff5f5" style="background-color:#fff5f5; border:1px dashed #ff9d9d; border-radius:10px; padding:24px 16px;">
                          <div style="font-family:'Segoe UI', Helvetica, Arial, sans-serif; font-size:12px; line-height:16px; letter-spacing:1.5px; text-transform:uppercase; color:#8a909c; padding-bottom:10px;">Your verification code</div>
                          <div style="font-family:'Courier New', Courier, monospace; font-size:40px; line-height:48px; font-weight:700; letter-spacing:10px; color:#d93a3f; padding-left:10px;">${otp}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Validity -->
                <tr>
                  <td align="center" style="padding:20px 32px 8px 32px; font-family:'Segoe UI', Helvetica, Arial, sans-serif; font-size:14px; line-height:22px; color:#5b6270;">
                    This code is valid for <strong style="color:#1a1d23;">5 minutes</strong>. Please do not close the verification page until you have entered it.
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:24px 32px 0 32px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr><td height="1" style="height:1px; line-height:1px; font-size:0; background-color:#eceef2;">&nbsp;</td></tr>
                    </table>
                  </td>
                </tr>

                <!-- Security notice -->
                <tr>
                  <td style="padding:20px 32px 32px 32px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td bgcolor="#f8f9fb" style="background-color:#f8f9fb; border-left:3px solid #ff5a5a; border-radius:6px; padding:14px 16px; font-family:'Segoe UI', Helvetica, Arial, sans-serif; font-size:13px; line-height:20px; color:#5b6270;">
                          <strong style="color:#1a1d23;">Security notice:</strong> Never share this OTP with anyone, including our support team. We will never ask you for it. If you didn&rsquo;t request this code, you can safely ignore this email.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 16px 0 16px; font-family:'Segoe UI', Helvetica, Arial, sans-serif; font-size:12px; line-height:20px; color:#8a909c;">
              This is an automated message, please do not reply.<br />
              &copy; ${new Date().getFullYear()} <strong style="color:#5b6270;">Your Company Name</strong>. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;

  await transport.sendMail({
    from: process.env.Gmail,
    to: email,
    subject,
    html,
    attachments: [
      {
        filename: "shopping-cart.png",
        path: "./assets/shopping-cart.png",
        cid: "brandlogo",
      },
    ],
  });
};

export default sendOtp;
