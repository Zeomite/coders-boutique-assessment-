const nodemailer = require("nodemailer");

exports.sendEmail = async (email, subject, message) => {
  try {
    const usermail = process.env.ADMIN_EMAIL;
    const userpass = process.env.NODEMAILER_PASS;
    if (!usermail || !userpass) {
      throw new Error("Enter valid Email and password");
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: usermail,
        pass: userpass,
      },
    });

    // Configure mail options
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: subject,
      text: message,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Email could not be sent");
  }
};
