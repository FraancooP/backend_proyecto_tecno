const nodemailer = require('nodemailer');

// Configurá con tu servicio de mail (puede ser Gmail, Outlook, SMTP propio, etc.)
// Ejemplo con Gmail (requiere activar "apps menos seguras" o usar OAuth2)
//La idea es usar una contraseña de aplicacion con nodemailer para poder mandar una verificacion y cambiar el estado de la cuenta
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'francoheredia2011@gmail.com',
    pass: 'akkm kxii cxyt itzh',  // mejor usar variable de entorno para esto
  },
});

const sendVerificationEmail = async (to, token) => {
  const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;
  const mailOptions = {
    from: 'francoheredia2011@gmail.com',
    to,
    subject: 'Verificación de cuenta',
    html: `
      <h1>Gracias por registrarte</h1>
      <p>Para activar tu cuenta hacé click en el siguiente enlace:</p>
      <a href="${verificationUrl}">Verificar cuenta</a>
      <p>Este enlace expira en 24 horas.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de verificación enviado a:', to);
  } catch (error) {
    console.error('Error enviando mail:', error);
  }
};

// ...existing code...
const sendResetPasswordEmail = async (to, token) => {
  const link = `http://localhost:3000/reset-password?token=${token}`; // Ajusta la URL según tu frontend
  const mailOptions = {
    from: 'francoheredia2011@gmail.com',
    to,
    subject: 'Recupera tu contraseña',
    html: `
      <h1>Recuperación de contraseña</h1>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${link}">${link}</a>
      <p>Si no solicitaste este cambio, ignora este correo.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de recuperación enviado a:', to);
  } catch (error) {
    console.error('Error enviando mail:', error);
  }
};

module.exports = { sendVerificationEmail, sendResetPasswordEmail };