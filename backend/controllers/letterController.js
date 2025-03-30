const User = require("../models/userModel");
const { uploadFileToDrive } = require("../utils/googleDrive");

exports.saveLetter = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { content } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const fileLink = await uploadFileToDrive(
      content,
      user.googleAccessToken,
      user.googleRefreshToken,
      user._id
    );

    res.status(200).json({ message: "Letter saved", link: fileLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving letter" });
  }
};
const { listUserFiles } = require("../utils/googleDrive");

exports.getLetters = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const files = await listUserFiles(
      user.googleAccessToken,
      user.googleRefreshToken,
      user._id
    );

    res.status(200).json({ files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching letters" });
  }
};
