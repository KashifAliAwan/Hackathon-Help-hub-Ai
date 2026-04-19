import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

export const sendTokenResponse = (user, statusCode, res, message) => {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    },
  );

  res.cookie("token", token, cookieOptions);
  return res.status(statusCode).json({
    success: true,
    message,
    token,
  });
};