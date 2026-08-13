// import nodemailer from "nodemailer"

// export const transport = nodemailer.createTransport({
//   host: 'smtp-relay.brevo.com',
//   port: 587,
//   auth: {
//     user: process.env.SMTP_USER, // Ensure this is set in your env variables
//     pass: process.env.SMTP_PASSWORD, // Use an app password if using Gmail
//   },
// });

import nodemailer from "nodemailer"

export const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
        pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD,
    },
    // only for local testing and not for production
    // this helps when you face SSL cert issues locally - self signed certificate issue
    tls: {
        rejectUnauthorized: false,
    },
});
