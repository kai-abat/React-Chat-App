const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
    // expiresIn: 5,
    expiresIn: "1d",
  });
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const matchPassword = async (enteredPassword, oldPassword) => {
  return await bcrypt.compare(enteredPassword, oldPassword);
};

const protect = async (req, res, next) => {
  try {
    const originalUrl = req.originalUrl;
    let token = "";

    // skip auth on socket.io temporary while looking for better solution
    if (originalUrl.startsWith("/socket.io")) {
      return next();
    }

    const authUrl = ["/api/users/login", "/api/users/register"];

    // console.log("middleware protect start...");
    // console.log(req);

    const headerAuth = req.headers.authorization;
    // console.log("headerAuth", headerAuth);

    // skip authentication if login or registration
    if (authUrl.includes(originalUrl) || originalUrl.startsWith("/socket.io")) {
      // console.log("Url is for authorization: ", originalUrl);
      return next();
    }

    // console.log("checking bearer token...");
    if (headerAuth && headerAuth.startsWith("Bearer")) {
      token = headerAuth.split(" ")[1];
      if (!token) {
        throw new Error("Not authorized");
      }
      // console.log("token", token);

      const authUser = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY,
        (err, decoded) => {
          if (err) return undefined;
          return decoded;
        }
      );
      // console.log("token verify: ", authUser);

      if (!authUser) {
        throw new Error("Not authorized");
      }

      req.authUser = authUser;

      req.user = await userModel
        .findById(authUser.user._id)
        .select("-password");
      // console.log("Found user: ", req.user);

      // console.log("middleware protect finish...");
      return next();
    }

    throw new Error("Not authorized");
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { generateToken, hashPassword, matchPassword, protect };
