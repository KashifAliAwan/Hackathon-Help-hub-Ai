import jwt from "jsonwebtoken";

const verifyAuthentication = (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    const token = authorizationHeader?.startsWith("Bearer ")
      ? authorizationHeader.slice(7)
      : authorizationHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is required",
      });
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default verifyAuthentication;
