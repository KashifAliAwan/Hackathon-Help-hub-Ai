import express from "express";
import verifyAuthentication from "../middlewares/verifyAuth.js";
import { getLeaderboard, listUsers } from "../controller/user.controller.js";

const router = express.Router();

router.use(verifyAuthentication);

router.get("/", listUsers);
router.get("/leaderboard", getLeaderboard);

export default router;
