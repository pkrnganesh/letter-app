const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.DRIVE_REDIRECT_URI
);

// Login - Verify ID Token and Issue JWT
exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      });
      await user.save();
    }

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Authentication failed" });
  }
};

// OAuth Consent URL - Drive Access
exports.googleDriveAuth = (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/drive.file"],
    state: req.user.userId, // Pass userId
  });
  res.redirect(url);
};

// OAuth Callback - Save tokens to DB
exports.googleDriveCallback = async (req, res) => {
  const { code, state } = req.query;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    const user = await User.findById(state);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.googleAccessToken = tokens.access_token;
    user.googleRefreshToken = tokens.refresh_token;
    await user.save();

    // ✅ Redirect user to Dashboard
    res.redirect("http://localhost:5173/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get tokens" });
  }
};

