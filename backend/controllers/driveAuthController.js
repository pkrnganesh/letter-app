const { google } = require("googleapis");
const User = require("../models/userModel");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.DRIVE_REDIRECT_URI
);

exports.googleDriveAuth = async (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/drive.file"],
    state: req.user.userId, // Pass userId in state
  });
  res.redirect(url);
};

exports.googleDriveCallback = async (req, res) => {
  const { code, state } = req.query;

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    const user = await User.findById(state);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.googleAccessToken = tokens.access_token;
    user.googleRefreshToken = tokens.refresh_token;
    await user.save();

    res.status(200).json({ message: "Drive access granted. Tokens saved." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get tokens" });
  }
};
