import { Router } from "express";
import { getMorceaux } from "../controllers/morceau.controller";

const router = Router();

router.get("/", getMorceaux);

export default router;