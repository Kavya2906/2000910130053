import express from "express";
const router = express.Router();
router.get("/", getTrains);
export default router;