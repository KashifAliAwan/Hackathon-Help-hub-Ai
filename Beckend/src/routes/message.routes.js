import express from "express";
import verifyAuthentication from "../middlewares/verifyAuth.js";
import { listMessages, sendMessage } from "../controller/message.controller.js";

const router = express.Router();

router.use(verifyAuthentication);

router.get("/", listMessages);
router.post("/", sendMessage);

export default router;
