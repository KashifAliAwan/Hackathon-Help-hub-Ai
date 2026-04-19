import express from "express";
import morgan from "morgan";
import cors from "cors";
import { config } from "dotenv";
import conectMongoDB from "./database/db.js";
import * as dns from "dns"; // For resolving hostnames...!
import authRoutes from "./routes/auth.routes.js";
import communityRoutes from "./routes/community.routes.js";
import requestRoutes from "./routes/request.routes.js";
import messageRoutes from "./routes/message.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import userRoutes from "./routes/user.routes.js";

dns.setDefaultResultOrder("ipv4first"); // For resolving hostnames to IPv4 addresses first...!
dns.setServers(["1.1.1.1", "8.8.8.8"]); // For setting custom DNS servers...!

// Environment variables config...!
config({
  path: "./.env",
});

// Note: Database connection here...!
conectMongoDB();

// Global variables...!
const port = process.env.PORT || 3000;
const app = express();

// Middlewares...!
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);

app.get("/test", (req, res) => {
  return res?.status(200).send({
    status: true,
    message: "Welcome Node.js",
  });
});

app.use((err, req, res, next) => {
  console.log("Unhandled error:", err);
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Server running...!
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
