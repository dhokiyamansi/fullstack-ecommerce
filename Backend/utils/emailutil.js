const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,  
  },
});


const sendOrderConfirmationEmail = async (userEmail, orderId) => {
  try {
    const mailOptions = {
      from: `"My Store" <${process.env.EMAIL_USER}>`,
      to: userEmail,  
      subject: "Order Confirmation - Your Order is Placed!",
      html: `
        <h2>Order Confirmation</h2>
        <p>Dear Customer,</p>
        <p>Thank you for shopping with us!</p>
        <p>Your order ID is <strong>${orderId}</strong>.</p>
        <p>We will notify you when your order is shipped.</p>
        <p>Best Regards, <br>Your E-commerce Team</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendOrderConfirmationEmail;

