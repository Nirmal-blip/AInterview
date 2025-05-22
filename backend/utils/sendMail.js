import nodemailer from "nodemailer"

export const sendMail = async(toMail, subject, body)=> {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "bhaveshgautam2302@gmail.com",  //FIT_NEST MAIL ID
          pass: "biskjkimtbzhajjn", //Fit-Nest password (use only app password)
        },
      });
      const info = await transporter.sendMail({
        from: "bhaveshgautam2302@gmail.com", // sender address
        to: toMail, // list of receivers
        subject: `${subject}`,
        html: `${body}`, // html body
      });
      console.log("Message sent: %s", info.messageId);
    } catch (err) {
      console.log(err);
    }
}

