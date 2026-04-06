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

const HomePage = () => {
  // This sends the user to the new Express route for Spotify Auth
  const handleLogin = () => {
    window.location.href = "http://127.0.0.1:5001/api/login";
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="flex flex-col items-center justify-center p-4 mt-20">
        <div className="max-w-md w-full bg-base-100 shadow-xl rounded-2xl p-8 text-center space-y-6">
          <h1 className="text-4xl font-bold text-primary">Vibe Filter</h1>

          <p className="text-base-content/70">
            Connect your Spotify account to start filtering your Liked Songs.
          </p>

          <button
            onClick={handleLogin}
            className="btn btn-primary w-full text-lg mt-4"
          >
            Log in with Spotify
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
