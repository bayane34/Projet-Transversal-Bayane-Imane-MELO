import { Router } from "express";
import { getArtistes } from "../controllers/artiste.controller";

const router = Router();

router.get("/", getArtistes);

export default router;