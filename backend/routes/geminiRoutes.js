import express from "express";
import { explainCode, generateCode, fixCode } from "../controllers/geminiController.js";

const router = express.Router();

router.post("/explain", explainCode);
router.post("/generate", generateCode);
router.post("/fix", fixCode);

export default router;
