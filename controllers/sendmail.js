const nodemailer = require("nodemailer");
const sendmail = async (req, res) => {
    try {
      // Create a transporter object using Gmail SMTP transport
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "your-email@gmail.com", // Replace with your Gmail address
          pass: "your-email-password"   // Replace with your Gmail password or App Password
        },
      });
  
      // Send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Rohan Singh👻" <rs1220525@gmail.com>', // sender address
        to: "rohan76singh1024@gmail.com", // list of receivers
        subject: "Hello User", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });
  
      console.log("Message sent: %s", info.messageId);
  
      // Respond with the message details
      res.json(info);
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Failed to send email");
    }
  };
module.exports=sendmail;