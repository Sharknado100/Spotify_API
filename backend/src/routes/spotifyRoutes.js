import express from "express";
import {
  callback,
  getPlaylists,
  login,
} from "../controllers/spotifyControllers.js";

const router = express.Router();

router.get("/login", login);
router.get("/callback", callback);
router.get("/playlists", getPlaylists);

export default router;
