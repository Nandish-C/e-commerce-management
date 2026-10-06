
const User = require("../models/User");

// Create User (find-or-create by email so the same shopper is not duplicated)
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, phone });
      await user.save();
    }

    res.json({
      message: "User Saved Successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
