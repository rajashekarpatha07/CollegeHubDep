// sendWelcomeEmail.js
import SibApiV3Sdk from 'sib-api-v3-sdk';

const sendWelcomeEmail = async (email, name, role = 'student') => {
  try {
    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.SENDINBLUE_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sender = {
      email: 'mongodb.server07@gmail.com',
      name: 'College Hub'
    };

    const subject = `Welcome to College Hub, ${name}!`;

    // Base HTML template
    let htmlContent = `
      <div style="background-color:#f4f4f4; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 25px 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); font-family: 'Segoe UI', sans-serif; color: #333;">
          <h2 style="color: #0056b3;">Hello ${name},</h2>
          <p style="font-size: 16px;">Welcome to <strong style="color:#007bff;">College Hub</strong>!</p>
          <p style="font-size: 15px;">We're thrilled to have you on board as a <strong>${role}</strong>.</p>
          <p style="font-size: 15px;">Stay tuned for exciting updates, important announcements, and learning resources that will help you grow and succeed.</p>
          <p style="font-size: 15px;">Don't forget to explore all the features we've built just for you!</p>
          <br/>
          <p style="color: #555;">Best regards,<br/><strong>College Team</strong></p>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
          </p>
        </div>
      </div>
    `;

    // Faculty-specific template
    if (role === 'faculty') {
      htmlContent = `
        <div style="background-color:#f4f4f4; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 25px 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); font-family: 'Segoe UI', sans-serif; color: #333;">
            <h2 style="color: #0056b3;">Hello ${name},</h2>
            <p style="font-size: 16px;">Welcome to <strong style="color:#007bff;">College Hub</strong>!</p>
            <p style="font-size: 15px;">We are honored to have you as part of our respected faculty team.</p>
            <p style="font-size: 15px;">Your mentorship and knowledge will play a vital role in shaping future minds.</p>
            <p style="font-size: 15px;">We look forward to your contributions, insights, and collaboration in making College Hub even stronger.</p>
            <br/>
            <p style="color: #555;">Warm regards,<br/><strong>College Team</strong></p>
            <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;"></p>
          </div>
        </div>
      `;
    }

    const receivers = [{ email, name }];

    await apiInstance.sendTransacEmail({
      sender,
      to: receivers,
      subject,
      htmlContent
    });

    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending email:', error.response?.body || error.message);
  }
};

const sendLoginWelcomeEmail = async (email, name, role = 'student') => {
    try {
      SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.SENDINBLUE_API_KEY;
  
      const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  
      const sender = {
        email: 'mongodb.server07@gmail.com',
        name: 'College Hub'
      };
  
      const subject = `Welcome back, ${name}!`;
  
      // Default (student) HTML content
      let htmlContent =  `
      <div style="background-color:#f4f4f4; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 25px 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); font-family: 'Segoe UI', sans-serif; color: #333;">
          <h2 style="color: #2c3e50;">Hello ${name},</h2>
          <p>Welcome back to <strong style="color: #007bff;">College Hub</strong>!</p>
          <p style="font-size: 15px;">✅ You are successfully logged in.</p>
          <p style="font-size: 15px;">We’re glad to see you again. Continue exploring updates, assignments, and resources tailored just for you.</p>
          <p style="font-size: 15px;">Let’s keep learning, growing, and achieving greatness together!</p>
          <br/>
          <p style="color: #555;">Best regards,<br/><strong>College Team</strong></p>
        </div>
      </div>
    `;
  
      // Faculty version
      if (role === 'faculty') {
        htmlContent =`
  <div style="background-color:#f4f4f4; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 25px 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); font-family: 'Segoe UI', sans-serif; color: #333;">
      <h2 style="color: #2c3e50;">Hello ${name},</h2>
      <p>Welcome back to <strong style="color: #007bff;">College Hub</strong>!</p>
      <p style="font-size: 15px;">✅ You are successfully logged in.</p>
      <p style="font-size: 15px;">We truly appreciate your ongoing efforts in mentoring and shaping young minds.</p>
      <p style="font-size: 15px;">Let’s make this session impactful and full of growth together!</p>
      <br/>
      <p style="color: #555;">Warm regards,<br/><strong>College Team</strong></p>
    </div>
  </div>
`;
      }
  
      const receivers = [{ email, name }];
  
      await apiInstance.sendTransacEmail({
        sender,
        to: receivers,
        subject,
        htmlContent
      });
  
      console.log(`✅ Login welcome email sent to ${email}`);
    } catch (error) {
      console.error('❌ Error sending login email:', error.response?.body || error.message);
    }
  };


  export default {
    sendWelcomeEmail,
    sendLoginWelcomeEmail
  };
  
