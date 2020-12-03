const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
  const msg = {
    to: email, // Change to your recipient
    from: 'oreltol1000@gmail.com', // Change to your verified sender
    subject: 'welcome',
    text: `welcome to the app, ${name}.`
  }

  sgMail
    .send(msg)
    .then(() => {
      // console.log('succes mail')
    })
    .catch(error => {
      console.error(error)
    })
}

const sendCancelEmail = (email, name) => {
  const msg = {
    to: email, // Change to your recipient
    from: 'oreltol1000@gmail.com', // Change to your verified sender
    subject: 'delete user',
    text: `we sad, ${name}.`
  }

  sgMail
    .send(msg)
    .then(() => {
      console.log('succes')
    })
    .catch(error => {
      console.error(error)
    })
}
module.exports = {
  sendWelcomeEmail,
  sendCancelEmail
}
