const message = (userName, siteName, resetUrl) => {
  return `
    <h2>Hello ${userName}</h2>
    <p>You are receiving this email because you have requested to reset your password for your account at ${siteName}. If you did not initiate this request, please ignore this message.</p>
    <p>Please note that this link is valid for 30 minutes from the time of this email. After that, you will need to request another password reset.</p>
    
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    
    <p>Regards..</p>
    `;
};

module.exports = message;
