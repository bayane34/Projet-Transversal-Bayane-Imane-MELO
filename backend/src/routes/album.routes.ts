import { Router } from "express";
import { getAlbums } from "../controllers/album.controller";

const router = Router();

router.get("/", getAlbums);

export default router;