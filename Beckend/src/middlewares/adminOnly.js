import UserModal from "../models/user.model.js";

const adminOnly = async (req, res, next) => {
  const userId = req.user?.id || req.params?.userId;

  try {
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    const user = await UserModal.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const canHelpRoles = ["Can Help", "Both"];
    if (!canHelpRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource",
      });
    }

    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default adminOnly;
