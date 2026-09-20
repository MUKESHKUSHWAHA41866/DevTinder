const nodemailer = require("nodemailer");

// Create a Nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.FROM_EMAIL, // Aapka Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Aapka Gmail App Password
  },
});

const run = async (Subject, body, toEmail) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL, 
      to: toEmail || process.env.TO_EMAIL, 
      subject: Subject,
      html: `<h1>${body}</h1>`,
    };

    const data = await transporter.sendMail(mailOptions);
    return data;
  } catch (error) {
    console.error("Nodemailer Email Error: ", error);
    throw error;
  }
};

module.exports = { run };