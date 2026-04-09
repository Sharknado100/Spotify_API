import { spotifyApi } from "../config/spotifyClient.js";

//Login through Spotify
export async function login(req, res) {
  const scopes = [
    "user-library-read",
    "playlist-read-private",
    "user-read-private",
    "playlist-modify-public",
    "playlist-modify-private",
  ];
  res.redirect(spotifyApi.createAuthorizeURL(scopes, "vibe-filter-auth", true));
}

//Catch user when Spotify sends them back
export async function callback(req, res) {
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
}

//Get the users playlists
export async function getPlaylists(req, res) {
  try {
    const token = spotifyApi.getAccessToken();
    if (!token) {
      return res.status(401).json({ error: "Server amnesia! No token found." });
    }

    const data = await spotifyApi.getUserPlaylists({ limit: 50 });

    const cleanPlaylists = data.body.items.map((playlist) => {
      return {
        id: playlist.id,
        name: playlist.name,
        image:
          playlist.images?.[0]?.url ||
          "https://placehold.co/300x300?text=No+Cover",
        trackCount: playlist.tracks?.total || 0,
      };
    });

    res.json(cleanPlaylists);
  } catch (error) {
    console.error("🚨 CRASH FETCHING PLAYLISTS:", error);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
}
