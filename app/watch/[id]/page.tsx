"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";

interface Video {
  title: string;
  description: string;
  link: string;
  thumbnailUrl: string;
  type: string;
  language?: string;
}

export default function WatchPage() {
  const { id } = useParams();
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [allVideos, setAllVideos] = useState<Video[]>([]);

  // Fetch videos from Firebase
  useEffect(() => {
    const videosRef = ref(database, "videos");
    onValue(videosRef, (snapshot) => {
      const data = snapshot.val();
      const arr: Video[] = data ? Object.values(data) as Video[] : [];
      setAllVideos(arr);

      const idx = parseInt(id as string);
      const found = arr[idx];
      if (found) {
        // Ensure embed link
        let embedLink = found.link;
        if (embedLink.includes("youtube.com/watch?v=")) {
          const videoId = new URL(embedLink).searchParams.get("v");
          embedLink = `https://www.youtube.com/embed/${videoId}`;
        } else if (embedLink.includes("youtu.be/")) {
          const videoId = embedLink.split("youtu.be/")[1];
          embedLink = `https://www.youtube.com/embed/${videoId}`;
        }
        setVideo({ ...found, link: embedLink });
      }
    });
  }, [id]);

  if (!video) {
    return <p className="text-center text-gray-400 mt-20">Video not found.</p>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Video Player */}
      <div className="relative w-full h-[70vh] bg-black">
        <iframe
          src={video.link}
          className="w-full h-full object-cover"
          allowFullScreen
        />

        {/* Back Button */}
        <Button
          onClick={() => router.push("/dashboard")}
          className="absolute top-6 left-6 bg-red-600 hover:bg-red-700"
        >
          ← Back
        </Button>
      </div>

      {/* Details Section */}
      <div className="px-10 py-6 space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold"
        >
          {video.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-gray-400 text-lg max-w-3xl"
        >
          {video.description}
        </motion.p>
      </div>

      {/* Suggested Videos */}
      <div className="px-10 py-6">
        <h2 className="text-2xl font-bold mb-4">More Like This</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {allVideos
            .filter((v) => v.type === video.type && v.title !== video.title)
            .slice(0, 6)
            .map((v, idx) => {
              let embedLink = v.link;
              if (embedLink.includes("youtube.com/watch?v=")) {
                const videoId = new URL(embedLink).searchParams.get("v");
                embedLink = `https://www.youtube.com/embed/${videoId}`;
              } else if (embedLink.includes("youtu.be/")) {
                const videoId = embedLink.split("youtu.be/")[1];
                embedLink = `https://www.youtube.com/embed/${videoId}`;
              }

              return (
                <div
                  key={idx}
                  className="bg-gray-900 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition"
                  onClick={() => router.push(`/watch/${allVideos.indexOf(v)}`)}
                >
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-bold truncate">{v.title}</h3>
                    <p className="text-xs text-gray-400">
                      {v.type} | {v.language || "Other"}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
