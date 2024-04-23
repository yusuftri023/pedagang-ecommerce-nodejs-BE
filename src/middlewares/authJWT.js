import jwt from "jsonwebtoken";
const { JWT_SECRET_KEY } = process.env;

export const JWTsign = async (userData) => {
  // ganti masa berlaku token untuk testing
  const token = jwt.sign(userData, JWT_SECRET_KEY, { expiresIn: 60 * 5 });
  return token;
};

export const auth = async (req, res, next) => {
  const { authorization } = req.signedCookies;

  if (!authorization) {
    return res.status(401).json({
      success: false,
      message:
        "No authorization cookies detected, you're not authorized to access this page!",
      data: null,
    });
  }
  jwt.verify(authorization, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid token, you're not authorized to access this page!",
        err: err.message,
        data: null,
      });
    }
    req.decodedToken = decoded;
    next();
  });
};
