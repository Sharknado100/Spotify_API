import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import SpotifyWebApi from "spotify-web-api-node";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();
//initialize Spotify keys
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

connectDB();
//middleware from original project
// if (process.env.NODE_ENV !== "production") {
//   app.use(
//     cors({
//       origin: "http://localhost:5173",
//     }),
//   );
// }

app.use(express.json()); //this middleware will parse the JSON bodies: req.body
app.use(rateLimiter);

//New middleware
app.use(cors());

//our simple custom middleware
// app.use((req,res,next) => {
//     console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//     next();
// })

//old note middleware
//app.use("/api/notes", notesRoutes);

//Login through Spotify
app.get("/api/login", (req, res) => {
  const scopes = [
    "user-library-read",
    "playlist-read-private",
    "playlist-modify-public",
    "playlist-modify-private",
  ];
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

//Catch user when Spotify sends them back
app.get("/api/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    spotifyApi.setAccessToken(data.body["access_token"]);
    spotifyApi.setRefreshToken(data.body["refresh_token"]);

    console.log("🎉 SUCCESS! Tokens acquired and saved to memory!");
    // Send user back to React frontend
    res.redirect("http://localhost:5173/");
  } catch (error) {
    console.log("Error during callback:", error);
    res.status(500).send("Error logging in to Spotify");
  }
});

//Get the users playlists
app.get("/api/playLists", async (req, res) => {
  try {
    const data = await spotifyApi.getUserPlaylists({ limit: 50 });
    const cleanPlaylists = data.body.items.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      image: playlist.images[0]?.url || "",
      trackCount: playlist.tracks.total,
    }));

    res.json(cleanPlaylists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server started on PORT:", PORT);
});
