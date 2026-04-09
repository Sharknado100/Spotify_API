// import React, { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import RateLimitedUI from "../components/RateLimitedUI";
// import api from "../lib/axios";
// import toast from "react-hot-toast";
// import NoteCard from "../components/NoteCard";
// import NotesNotFound from "../components/NotesNotFound";

// const HomePage = () => {
//   const [isRateLimited, setIsRateLimited] = useState(false);
//   const [notes, setNotes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNotes = async () => {
//       try {
//         const res = await api.get("/notes");
//         console.log(res.data);
//         setNotes(res.data);
//         setIsRateLimited(false);
//       } catch (error) {
//         console.log("Error fetching notes");
//         console.log(error.response);
//         if (error.response?.status == 429) {
//           setIsRateLimited(true);
//         } else {
//           toast.error("Failed to load notes");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotes();
//   }, []);

//   return (
//     <div className="min-h-screen">
//       <Navbar />

//       {isRateLimited && <RateLimitedUI />}
//       <div className="max-w-7xl mx-auto p-4 mt-6">
//         {loading && (
//           <div className="text-center text-primary py-10">Loading notes...</div>
//         )}
//         {notes.length === 0 && !isRateLimited && <NotesNotFound />}
//         {notes.length > 0 && !isRateLimited && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {notes.map((note) => (
//               <NoteCard key={note._id} note={note} setNotes={setNotes} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import React from "react";
import Navbar from "../components/Navbar";
import { useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import RateLimitedUI from "../components/RateLimitedUI";

const HomePage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  // This sends the user to the new Express route for Spotify Auth
  const handleLogin = () => {
    window.location.href = "http://127.0.0.1:5001/api/login";
  };

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const response = await api.get("http://127.0.0.1:5001/api/playlists");
      setPlaylists(response.data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      toast.error(
        "Failed to fetch. Make sure you logged in with Spotify first!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4 mt-10">
        {/* Control Panel */}
        <div className="bg-base-100 shadow-xl rounded-2xl p-8 text-center space-y-6 mb-10">
          <h1 className="text-4xl font-bold text-primary">Vibe Filter</h1>
          <p className="text-base-content/70">
            Step 1: Log in. Step 2: Fetch your playlists. Step 3: Choose your
            target.
          </p>

          <div className="flex justify-center gap-4 mt-4">
            <button onClick={handleLogin} className="btn btn-primary">
              Log in with Spotify
            </button>
            <button
              onClick={fetchPlaylists}
              className="btn btn-secondary outline"
              disabled={loading}
            >
              {loading ? "Loading..." : "Fetch My Playlists"}
            </button>
          </div>
        </div>

        {/* Playlist Grid */}
        {playlists.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="card bg-base-100 shadow-xl hover:scale-105 transition-transform cursor-pointer border border-transparent hover:border-primary"
              >
                <figure>
                  <img
                    src={
                      playlist.image ||
                      "https://placehold.co/300x300?text=No+Cover"
                    }
                    alt={playlist.name}
                    className="w-full aspect-square object-cover"
                  />
                </figure>
                <div className="card-body p-4">
                  <h2 className="card-title text-lg truncate">
                    {playlist.name}
                  </h2>
                  <p className="text-sm text-base-content/60">
                    {playlist.trackCount} Tracks
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
