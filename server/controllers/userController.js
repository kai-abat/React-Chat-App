const userModel = require("../models/userModel");
const validator = require("validator");
const { hashPassword, generateToken, matchPassword } = require("../auth/auth");

const registerUser = async (req, res) => {
  try {
    // extract user
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json("User with the given email already exists...");
    }
    if (!name || !email || !password) {
      return res.status(400).json("All fields are required...");
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json("Email must be a valid email...");
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json("Password must be a strong password...");
    }

    user = new userModel({ name, email, password });

    // hash the password using bcrypt
    user.password = await hashPassword(user.password);

    await user.save();

    // generate jwt token
    const token = generateToken(user);

    res
      .status(200)
      .json({
        _id: user._id,
        name,
        email,
        token,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Server Login:", email, password);
    let user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json(
          "Invalid email or password...: EMAIL:" +
            email +
            "??" +
            password +
            ":PW"
        );

    const isValidPassword = await matchPassword(password, user.password);
    if (!isValidPassword) res.status(400).json("Invalid email or password2...");

    const token = generateToken(user);

    console.log("LOGIN:", user);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email,
      token,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const findUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { email: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    const users = await userModel
      .find(keyword)
      .find({ _id: { $ne: req.user._id } });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

const getAuthUserInfo = async (req, res) => {
  try {
    console.log("getAuthUserInfo...");
    console.log("getAuthUserInfo: req.user:", req.user);
    res.status(200).json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  findUser,
  getUsers,
  searchUsers,
  getAuthUserInfo,
};
