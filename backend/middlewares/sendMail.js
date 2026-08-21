// import nodemailer from "nodemailer"

// export const transport = nodemailer.createTransport({
//   host: 'smtp-relay.brevo.com',
//   port: 587,
//   auth: {
//     user: process.env.SMTP_USER, // Ensure this is set in your env variables
//     pass: process.env.SMTP_PASSWORD, // Use an app password if using Gmail
//   },
// });

// import nodemailer from "nodemailer"

// export const transport = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
//         pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD,
//     },
//     // only for local testing and not for production
//     // this helps when you face SSL cert issues locally - self signed certificate issue
//     tls: {
//         rejectUnauthorized: false,
//     },
// });

import nodemailer from "nodemailer";

const getTransporter = () => {
    const emailUser = process.env.SMTP_USER || process.env.NODE_CODE_SENDING_EMAIL_ADDRESS;
    const rawPass = process.env.SMTP_PASSWORD || process.env.NODE_CODE_SENDING_EMAIL_PASSWORD || "";
    const emailPass = rawPass.replace(/\s+/g, "");

    // 1. Explicit SMTP host configured (e.g. Brevo, SendGrid, Mailgun)
    if (process.env.SMTP_HOST) {
        const port = Number(process.env.SMTP_PORT || 587);
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port,
            secure: port === 465,
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });
    }

    // 2. Gmail address / Gmail service
    if (emailUser && emailUser.includes("@gmail.com")) {
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: emailUser,
                pass: emailPass,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }

    // 3. Fallback Brevo relay
    return nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });
};

export const transport = getTransporter();