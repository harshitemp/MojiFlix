"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface Video {
  title: string;
  description: string;
  link: string;
  thumbnail: string;
  type: string;
  language?: string;
}

const categories = ["Movie", "Episode", "Horror", "Clip", "Trailer", "Action"];
const languages = ["Telugu", "Hindi", "Tamil", "Other"];

export default function UserDashboard() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [heroIndex, setHeroIndex] = useState(0);

  // Fetch videos from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("videos") || "[]");
    setVideos(stored);
  }, []);

  // Latest 5 episodes for hero carousel
  const latestEpisodes = videos
    .filter((v) => v.type === "Episode")
    .sort((a, b) => 0) // If you want to sort by date, replace this with a date field
    .slice(0, 5);

  // Auto-rotate hero
  useEffect(() => {
    if (latestEpisodes.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % latestEpisodes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [latestEpisodes]);

  // Filter videos (by search + category + language)
  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? video.type === filter : true;
    const matchesLanguage =
      languageFilter
        ? languageFilter === "Other"
          ? !["Telugu", "Hindi", "Tamil"].includes(video.language || "")
          : video.language === languageFilter
        : true;
    return matchesSearch && matchesFilter && matchesLanguage;
  });

  // Group videos by type
  const groupedVideos: Record<string, Video[]> = {};
  categories.forEach((cat) => {
    groupedVideos[cat] = filteredVideos
      .filter((v) => v.type === cat)
      .filter((v) => !(cat === "Episode" && latestEpisodes.includes(v))); // Remove latest episodes from normal carousel
  });

  return (
    <div className="bg-black min-h-screen text-white font-sans">
      {/* Navbar */}
      <div className="flex items-center justify-between px-10 py-6 bg-gradient-to-b from-black/90 to-transparent fixed top-0 w-full z-20">
        <Image src="/logo.png" alt="Moji Flix Logo" width={140} height={50} className="object-contain" />

        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search movies, clips, trailers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white placeholder:text-gray-500 w-72 rounded-full px-4 py-2"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-full"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-full"
          >
            <option value="">All Languages</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Latest Episodes Hero Carousel */}
      {latestEpisodes.length > 0 && (
        <div className="relative h-[60vh] w-full pt-20 mb-12">
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
                src={latestEpisodes[heroIndex].thumbnail}
                alt={latestEpisodes[heroIndex].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-20 left-10 max-w-xl">
            <motion.h1
              key={latestEpisodes[heroIndex].title}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-3xl font-extrabold mb-2"
            >
              {latestEpisodes[heroIndex].title}
            </motion.h1>
            <motion.p
              key={latestEpisodes[heroIndex].description}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="text-gray-300 mb-4 line-clamp-3"
            >
              {latestEpisodes[heroIndex].description}
            </motion.p>
            <Button
              onClick={() => (window.location.href = `/watch/${videos.indexOf(latestEpisodes[heroIndex])}`)}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full text-lg shadow-xl"
            >
              ▶ Play
            </Button>
          </div>

          {/* Hero Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
            {latestEpisodes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroIndex(idx)}
                className={`w-3 h-3 rounded-full ${idx === heroIndex ? "bg-red-600" : "bg-gray-500"}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Carousels by category */}
      <div className="px-6 space-y-14">
        {categories.map(
          (cat) =>
            groupedVideos[cat]?.length > 0 && (
              <div key={cat} className="space-y-4">
                <h2 className="text-2xl font-bold tracking-wide border-l-4 border-red-600 pl-3">{cat}</h2>
                <div className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
                  {groupedVideos[cat].map((video, idx) => (
                    <motion.div key={idx} whileHover={{ scale: 1.08 }} className="snap-start">
                      <Card
                        className="relative min-w-[220px] bg-gray-900 border-none rounded-xl overflow-hidden shadow-lg cursor-pointer group"
                        onClick={() => (window.location.href = `/watch/${videos.indexOf(video)}`)}
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="h-40 w-full object-cover group-hover:brightness-75 transition"
                        />
                        <CardContent className="p-3">
                          <h3 className="font-bold text-sm truncate">{video.title}</h3>
                          <p className="text-xs text-gray-400 truncate">{video.type} | {video.language || "Other"}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
        )}

        {filteredVideos.length === 0 && (
          <p className="text-center text-gray-500 mt-20 text-lg">No videos found.</p>
        )}
      </div>
    </div>
  );
}
