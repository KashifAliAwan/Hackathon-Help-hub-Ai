import express from "express";
import verifyAuthentication from "../middlewares/verifyAuth.js";
import {
  createRequest,
  getRequestById,
  listRequests,
  updateRequestStatus,
  volunteerForRequest,
} from "../controller/request.controller.js";

const router = express.Router();

router.use(verifyAuthentication);

router.get("/", listRequests);
router.post("/", createRequest);
router.get("/:id", getRequestById);
router.post("/:id/helpers", volunteerForRequest);
router.patch("/:id/status", updateRequestStatus);

export default router;
