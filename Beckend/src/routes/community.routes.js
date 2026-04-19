import express from "express";
import verifyAuthentication from "../middlewares/verifyAuth.js";
import {
  getBootstrap,
  getDashboard,
  getInsights,
} from "../controller/community.controller.js";

const router = express.Router();

router.use(verifyAuthentication);

router.get("/bootstrap", getBootstrap);
router.get("/dashboard", getDashboard);
router.get("/insights", getInsights);

export default router;
