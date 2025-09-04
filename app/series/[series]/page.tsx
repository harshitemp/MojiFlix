"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import YouTube from "react-youtube";

interface Video {
  title: string;
  description: string;
  link: string;
  thumbnailUrl: string;
  type: string;
  series?: string;
}

export default function SeriesPage() {
  const { series } = useParams();
  const router = useRouter();
  const [episodes, setEpisodes] = useState<Video[]>([]);
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);

  useEffect(() => {
    const videosRef = ref(database, "videos");
    onValue(videosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.values(data) as Video[];
        setAllVideos(arr);

        const filtered = arr.filter(
          (v) => v.type === "Episode" && v.series === decodeURIComponent(series as string)
        );

        setEpisodes(filtered);
        setCurrentIndex(0);
        setShowNextButton(false);
      }
    });
  }, [series]);

  const handleNextEpisode = () => {
    if (currentIndex < episodes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowNextButton(false);
    }
  };

  const handleWatchEpisode = (ep: Video) => {
    router.push(`/watch/${allVideos.indexOf(ep)}`);
  };

  const handleVideoEnd = () => {
    setShowNextButton(true);
  };

  return (
    <div className="bg-black min-h-screen text-white p-8 relative">
      <Button
        onClick={() => router.back()}
        className="mb-6 bg-red-600 hover:bg-red-700"
      >
        ← Back
      </Button>

      <h1 className="text-3xl font-bold mb-6">
        {decodeURIComponent(series as string)}
      </h1>

      {episodes.length > 0 && (
        <div className="mb-8">
          {/* YouTube Player */}
          <YouTube
            videoId={episodes[currentIndex].link.split("/embed/")[1]}
            opts={{
              width: "100%",
              height: "400",
              playerVars: { autoplay: 1 },
            }}
            onEnd={handleVideoEnd}
          />

          <div className="mt-4 text-center">
            <h2 className="text-2xl font-semibold">
              {episodes[currentIndex].title}
            </h2>
            <p className="text-gray-400 mt-1">
              {episodes[currentIndex].description}
            </p>

            <div className="mt-4">
              <Button
                onClick={() => handleWatchEpisode(episodes[currentIndex])}
                className="bg-green-600 hover:bg-green-700"
              >
                ▶ Watch in Player Page
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Episode list */}
      <div className="space-y-6">
        {episodes.map((ep, idx) => (
          <div
            key={idx}
            className={`flex gap-4 bg-gray-900 p-4 rounded-xl cursor-pointer hover:bg-gray-800 ${
              idx === currentIndex ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => {
              setCurrentIndex(idx);
              setShowNextButton(false);
            }}
          >
            <img
              src={ep.thumbnailUrl}
              alt={ep.title}
              className="w-40 h-24 object-cover rounded-lg"
            />
            <div>
              <h2 className="text-xl font-semibold">{ep.title}</h2>
              <p className="text-gray-400 text-sm">{ep.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Next Episode Button (bottom-right) */}
      {showNextButton && currentIndex < episodes.length - 1 && (
        <Button
          onClick={handleNextEpisode}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 shadow-lg rounded-full px-6 py-3"
        >
          Next Episode →
        </Button>
      )}
    </div>
  );
}
