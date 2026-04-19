import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userRoles = ["Need Help", "Can Help", "Both"];

/*** User Schema ***/
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: userRoles,
      default: "Both",
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      trim: true,
      default: null,
    },
    trustScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 70,
    },
    badges: {
      type: [String],
      default: ["New Member"],
    },
    contributions: {
      type: Number,
      min: 0,
      default: 0,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
      select: false,
    },
    otpExpires: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    collection: "users",
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  if (!this.password) {
    throw new Error("Password is required");
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.allowedRoles = userRoles;

const UserModal = mongoose.model("User", userSchema);
export default UserModal;
