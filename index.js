import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route to handle contact form submission
app.post('/api/contact', (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  // Create a transporter using your email provider's SMTP settings
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Set up email options
  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, // Your email address
    subject: `Contact form submission: ${subject}`,
    text: `
      You have a new contact form submission:

      Name: ${firstName} ${lastName}
      Email: ${email}
      Subject: ${subject}
      Message: ${message}
    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({ error: 'Failed to send email' });
    }
    res.status(200).send({ message: 'Email sent successfully!' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
