const nodemailer = require('nodemailer');
const config = require('config');

const opass = config.get('emailpass');



function sendMailToUser(email){

    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth: {
            user: 'thorveshubham@gmail.com',
            pass: opass
          }
    });
    var mailOptions = {
        from: 'thorveshubham@gmail.com',
        to: email,
        subject: 'Sending Email using Node.js',
        text: 'Ala ka'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
          return false;
        } else {
          return true;
        }
      });
}

module.exports.sendMailToUser = sendMailToUser;