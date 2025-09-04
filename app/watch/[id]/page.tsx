"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

interface Video {
  title: string;
  description: string;
  link: string;
  thumbnailUrl: string;
  type: string;
  series?: string;
  language?: string;
}

export default function WatchPage() {
  const { id } = useParams();
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [seriesEpisodes, setSeriesEpisodes] = useState<Video[]>([]);
  const [seriesIndex, setSeriesIndex] = useState<number>(-1);

  // Fetch videos from Firebase
  useEffect(() => {
    const videosRef = ref(database, "videos");
    onValue(videosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.values(data) as Video[];
        setVideos(arr);

        const idx = Number(id);
        setCurrentIndex(idx);

        if (arr[idx]?.series) {
          const filtered = arr.filter(
            (v) => v.series === arr[idx].series && v.type === "Episode"
          );
          setSeriesEpisodes(filtered);

          const epIndex = filtered.findIndex((v) => v.title === arr[idx].title);
          setSeriesIndex(epIndex);
        } else {
          setSeriesEpisodes([]);
          setSeriesIndex(-1);
        }
      }
    });
  }, [id]);

  if (currentIndex === -1 || !videos[currentIndex]) return null;

  const video = videos[currentIndex];

  const handleNextEpisode = () => {
    if (seriesIndex !== -1 && seriesIndex < seriesEpisodes.length - 1) {
      const nextEpisode = seriesEpisodes[seriesIndex + 1];
      const nextIndex = videos.findIndex((v) => v.title === nextEpisode.title);
      if (nextIndex !== -1) {
        router.push(`/watch/${nextIndex}`);
      }
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-8 relative">
      {/* Back Button */}
      <Button
        onClick={() => router.back()}
        className="mb-6 bg-red-600 hover:bg-red-700"
      >
        ← Back
      </Button>

      {/* Video Player */}
      <div className="flex flex-col items-center">
        <iframe
          width="100%"
          height="500"
          src={`${video.link}?autoplay=1`}
          title={video.title}
          className="rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        <h1 className="text-3xl font-bold mt-4">{video.title}</h1>
        <p className="text-gray-400 mt-2">{video.description}</p>
      </div>

      {/* Floating Next Episode Button - only for series */}
      {video.series &&
        seriesIndex !== -1 &&
        seriesIndex < seriesEpisodes.length - 1 && (
          <Button
            onClick={handleNextEpisode}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 shadow-lg rounded-full px-6 py-3"
          >
            Next Episode →
          </Button>
        )}

      {/* Related Videos - only for category/type */}
      {!video.series && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">
            More {video.type} Videos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {videos
              .filter((v) => v.type === video.type && v.title !== video.title)
              .slice(0, 6)
              .map((v, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition"
                  onClick={() => router.push(`/watch/${videos.indexOf(v)}`)}
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
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
