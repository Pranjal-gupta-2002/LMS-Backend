import nodeMailer from "nodemailer";

export const sendEmail = async (options) => {
    var transporter = nodeMailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "30785803763d56",
          pass: "cdf9280fa873c8"
        }
      });
  const mailoptions = {
    from:process.env.SMPT_MAIL,
    to:options.email,
    subject:options.subject,
    text:options.message
  }

  await transporter.sendMail(mailoptions)
};