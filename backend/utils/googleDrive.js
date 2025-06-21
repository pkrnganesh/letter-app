const { google } = require("googleapis");
const User = require("../models/userModel");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.DRIVE_REDIRECT_URI
);

exports.uploadFileToDrive = async (content, accessToken, refreshToken, userId) => {
  try {
    oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // Refresh token if access token expired
    oAuth2Client.on("tokens", async (tokens) => {
      if (tokens.refresh_token) {
        await User.findByIdAndUpdate(userId, {
          googleAccessToken: tokens.access_token,
          googleRefreshToken: tokens.refresh_token,
        });
      }
    });

    const drive = google.drive({ version: "v3", auth: oAuth2Client });
    const today = new Date().toISOString().split("T")[0]; // "2025-06-19"
    const fileMetadata = {
      name: `Letter - ${today}.txt`, // ✅ Updated name here
    };
    const media = {
      mimeType: "text/plain",
      body: content,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    return response.data.webViewLink;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
exports.listUserFiles = async (accessToken, refreshToken, userId) => {
  try {
    oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // Refresh token handling
    oAuth2Client.on("tokens", async (tokens) => {
      if (tokens.refresh_token) {
        await User.findByIdAndUpdate(userId, {
          googleAccessToken: tokens.access_token,
          googleRefreshToken: tokens.refresh_token,
        });
      }
    });

    const drive = google.drive({ version: "v3", auth: oAuth2Client });

    const response = await drive.files.list({
      q: "mimeType='text/plain'",
      pageSize: 10,
      fields: "files(id, name, webViewLink)",
    });

    return response.data.files;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
