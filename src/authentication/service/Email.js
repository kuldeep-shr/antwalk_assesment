import nodemailer from "nodemailer";
const { EMAIL_FROM, EMAIL_PORT, EMAIL_PWD, EMAIL_HOST } = process.env;

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PWD,
      },
    });

    let mailOptions = {
      from: EMAIL_FROM,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    let info = await transporter.sendMail(mailOptions);
    return {
      message: "Email successfully sent!",
      messageId: info.messageId,
    };
  } catch (error) {
    throw "Error occurred while sending email:";
  }
};

export { sendEmail };
