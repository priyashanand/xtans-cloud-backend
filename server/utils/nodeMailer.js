const nodemailer = require("nodemailer")
const { google } = require('googleapis');
require('dotenv').config();

const createTransporter = async () => {
    try {
      const oauth2Client = new google.auth.OAuth2(
          process.env.CLIENT_ID,
          process.env.CLIENT_SECRET,
          "https://developers.google.com/oauthplayground/"
        );
 
        oauth2Client.setCredentials({
          refresh_token: process.env.REFRESH_TOKEN,
        });
 
        const accessToken = await new Promise((resolve, reject) => {
          oauth2Client.getAccessToken((err, token) => {
            if (err) {
              console.log("could not generate access token")
              console.log("*ERR: ", err)
              reject();
            }
            resolve(token); 
          });
        });
 
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: process.env.USER_EMAIL,
            accessToken,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
          },
        });
        
        return transporter;
    } catch (err) {
      return err
    }
  };

module.exports = createTransporter