"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ref, query, orderByChild, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface Video {
  title: string;
  description: string;
  link: string;
  thumbnailUrl: string;
  type: string;
  language?: string;
  series?: string;
  createdAt?: number;
}

const categories = ["Movie", "Horror", "Clip", "Trailer", "Action", "Song"];
const languages = ["Telugu", "Hindi", "Tamil", "Other"];

export default function UserDashboard() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filter, setFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [heroIndex, setHeroIndex] = useState(0);
  const router = useRouter();

  // ✅ Fetch videos
  useEffect(() => {
    const videosRef = ref(database, "videos");
    const q = query(videosRef, orderByChild("createdAt"));
    onValue(q, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allVideos = Object.values(data) as Video[];
        setVideos(allVideos);
      } else {
        setVideos([]);
      }
    });
  }, []);

  // ✅ Latest episodes for hero
  const latestEpisodes = videos
    .filter((v) => v.type?.toLowerCase() === "episode")
    .slice(-5)
    .reverse();

  // ✅ Auto-rotate hero
  useEffect(() => {
    if (latestEpisodes.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % latestEpisodes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [latestEpisodes]);

  // ✅ Apply filters
  const filteredVideos = videos.filter((video) => {
    const matchesFilter = filter ? video.type === filter : true;
    const matchesLanguage = languageFilter
      ? languageFilter === "Other"
        ? !["Telugu", "Hindi", "Tamil"].includes(video.language || "")
        : video.language === languageFilter
      : true;
    return matchesFilter && matchesLanguage;
  });

  // ✅ Group by series
  const episodesBySeries: Record<
    string,
    { seriesName: string; episodes: Video[] }
  > = {};
  filteredVideos
    .filter((v) => v.type?.toLowerCase() === "episode")
    .forEach((ep) => {
      const normalizedKey = ep.series
        ? ep.series.trim().toLowerCase()
        : ep.title.trim().toLowerCase();
      const displayName = ep.series?.trim() || ep.title.trim();

      if (!episodesBySeries[normalizedKey]) {
        episodesBySeries[normalizedKey] = {
          seriesName: displayName,
          episodes: [],
        };
      }
      episodesBySeries[normalizedKey].episodes.push(ep);
    });

  // ✅ Group categories
  const groupedVideos: Record<string, Video[]> = {};
  categories.forEach((cat) => {
    groupedVideos[cat] = filteredVideos.filter((v) => v.type === cat);
  });

  // ✅ Auto-scroll helper (one card every 10s)
  const startStepScroll = (el: HTMLDivElement, step = 240) => {
    return setInterval(() => {
      if (!el) return;
      const { scrollLeft, clientWidth, scrollWidth } = el;

      // If at end → reset
      if (scrollLeft + clientWidth >= scrollWidth - step) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 10000); // every 10s
  };

  // ✅ Refs
  const seriesRef = useRef<HTMLDivElement | null>(null);
  const catRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ✅ Attach auto-scroll
  useEffect(() => {
    const timers: ReturnType<typeof setInterval>[] = [];

    if (seriesRef.current && Object.keys(episodesBySeries).length > 4) {
      timers.push(startStepScroll(seriesRef.current));
    }

    categories.forEach((cat) => {
      const ref = catRefs.current[cat];
      if (ref && groupedVideos[cat]?.length > 4) {
        timers.push(startStepScroll(ref));
      }
    });

    return () => timers.forEach((t) => clearInterval(t));
  }, [videos, groupedVideos, episodesBySeries]);

  return (
    <div className="bg-black min-h-screen text-white font-sans">
      {/* Navbar */}
      <div className="flex items-center justify-between px-10 py-6 bg-gradient-to-b from-black/90 to-transparent fixed top-0 w-full z-20">
        <Image
          src="/logo.png"
          alt="Moji Flix Logo"
          width={140}
          height={50}
          className="object-contain"
        />

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search movies, clips, trailers..."
            className="bg-gray-900 border border-gray-700 text-white placeholder:text-gray-500 w-72 rounded-full px-4 py-2 cursor-pointer"
            onFocus={() => router.push("/search")}
            readOnly
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-full"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="Episode">Episodes</option>
          </select>

          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-full"
          >
            <option value="">All Languages</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Carousel */}
      {latestEpisodes.length > 0 && (
        <div className="relative h-[60vh] w-full pt-24 mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img
                src={latestEpisodes[heroIndex].thumbnailUrl}
                alt={latestEpisodes[heroIndex].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-20 left-10 max-w-xl">
            <h1 className="text-3xl font-extrabold mb-2">
              {latestEpisodes[heroIndex].title}
            </h1>
            <p className="text-gray-300 mb-4 line-clamp-3">
              {latestEpisodes[heroIndex].description}
            </p>
            <Button
              onClick={() =>
                router.push(`/watch/${videos.indexOf(latestEpisodes[heroIndex])}`)}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full text-lg shadow-xl"
            >
              ▶ Play
            </Button>
          </div>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {latestEpisodes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroIndex(idx)}
                className={`w-3 h-3 rounded-full transition ${
                  heroIndex === idx ? "bg-red-600" : "bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Series Section */}
      {Object.keys(episodesBySeries).length > 0 && (
        <div className="px-6 space-y-14">
          <h2 className="text-2xl font-bold tracking-wide border-l-4 border-red-600 pl-3">
            Series
          </h2>
          <div
            ref={seriesRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          >
            {Object.keys(episodesBySeries).map((seriesKey, idx) => {
              const { seriesName, episodes } = episodesBySeries[seriesKey];
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.08 }}
                  className="snap-start"
                >
                  <Card
                    className="relative min-w-[220px] bg-gray-900 border-none rounded-xl overflow-hidden shadow-lg cursor-pointer group"
                    onClick={() =>
                      router.push(`/series/${encodeURIComponent(seriesName)}`)
                    }
                  >
                    <img
                      src={episodes[0].thumbnailUrl}
                      alt={seriesName}
                      className="h-40 w-full object-cover group-hover:brightness-75 transition"
                    />
                    <CardContent className="p-3">
                      <h3 className="font-bold text-sm truncate">{seriesName}</h3>
                      <p className="text-xs text-gray-400">
                        {episodes.length} Episodes
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Other categories */}
      <div className="px-6 space-y-14 mt-10">
        {categories.map(
          (cat) =>
            groupedVideos[cat]?.length > 0 && (
              <div key={cat} className="space-y-4">
                <h2 className="text-2xl font-bold tracking-wide border-l-4 border-red-600 pl-3">
                  {cat}
                </h2>
                <div
                  ref={(el) => {
                    catRefs.current[cat] = el;
                  }}
                  className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
                >
                  {groupedVideos[cat].map((video, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.08 }}
                      className="snap-start"
                    >
                      <Card
                        className="relative min-w-[220px] bg-gray-900 border-none rounded-xl overflow-hidden shadow-lg cursor-pointer group"
                        onClick={() =>
                          router.push(`/watch/${videos.indexOf(video)}`)}
                      >
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="h-40 w-full object-cover group-hover:brightness-75 transition"
                        />
                        <CardContent className="p-3">
                          <h3 className="font-bold text-sm truncate">
                            {video.title}
                          </h3>
                          <p className="text-xs text-gray-400 truncate">
                            {video.type} | {video.language || "Other"}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
        )}

        {filteredVideos.length === 0 && (
          <p className="text-center text-gray-500 mt-20 text-lg">
            No videos found.
          </p>
        )}
      </div>
    </div>
  );
}
