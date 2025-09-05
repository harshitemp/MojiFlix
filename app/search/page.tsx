"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ref, query, orderByChild, onValue, limitToLast } from "firebase/database";
import { database } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

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

const alphabets = "abcdefghijklmnopqrstuvwxyz".split("");
const numbers = "0123456789".split("");

export default function SearchPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchPrefix, setSearchPrefix] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  // ✅ Fetch only last 15 videos ordered by createdAt
  useEffect(() => {
    const videosRef = ref(database, "videos");
    const q = query(videosRef, orderByChild("createdAt"), limitToLast(15));

    onValue(q, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allVideos = Object.values(data) as Video[];
        // reverse so latest is first
        setVideos(allVideos.reverse());
      } else {
        setVideos([]);
      }
    });
  }, []);

  // ✅ Filter videos by prefix and enforce max 15
  const filteredVideos = videos
    .filter((video) =>
      searchPrefix
        ? video.title.toLowerCase().startsWith(searchPrefix.toLowerCase())
        : true
    )
    .slice(0, 15); // enforce only 15 max

  // ✅ Update suggestions
  useEffect(() => {
    if (!searchPrefix) {
      setSuggestions([]);
      return;
    }
    const matches = videos
      .map((v) => v.title)
      .filter((title) =>
        title.toLowerCase().startsWith(searchPrefix.toLowerCase())
      )
      .slice(0, 6); // show top 6
    setSuggestions(matches);
  }, [searchPrefix, videos]);

  return (
    <div className="bg-black min-h-screen text-white flex">
      {/* Left Sidebar */}
      <div className="w-60 bg-gray-900 p-4 flex flex-col gap-4">
        {/* Search Box */}
        <Input
          type="text"
          placeholder="Search..."
          value={searchPrefix}
          onChange={(e) => setSearchPrefix(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 px-3 py-2 rounded-md"
        />

        {/* Keyboard Grid */}
        <div className="grid grid-cols-6 gap-2">
          {alphabets.map((letter) => (
            <Button
              key={letter}
              onClick={() => setSearchPrefix(letter)}
              className={`px-2 py-2 text-sm ${
                searchPrefix.toLowerCase() === letter
                  ? "bg-red-600"
                  : "bg-gray-800"
              }`}
            >
              {letter}
            </Button>
          ))}
          {numbers.map((num) => (
            <Button
              key={num}
              onClick={() => setSearchPrefix(num)}
              className={`px-2 py-2 text-sm ${
                searchPrefix === num ? "bg-red-600" : "bg-gray-800"
              }`}
            >
              {num}
            </Button>
          ))}
        </div>

        {/* Suggestions */}
        <div className="mt-4 flex flex-col gap-1">
          {suggestions.map((s, idx) => (
            <p
              key={idx}
              className="text-gray-300 text-sm cursor-pointer hover:text-white"
              onClick={() => setSearchPrefix(s)}
            >
              {s}
            </p>
          ))}
        </div>

        {/* Back + Clear Buttons */}
        <div className="mt-auto flex flex-col gap-2">
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-gray-700 w-full"
          >
            ⬅ Back
          </Button>
          <Button
            onClick={() => setSearchPrefix("")}
            className="bg-gray-700 w-full"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Right Results Section */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {searchPrefix ? `Results for "${searchPrefix}"` : "Latest 15 Videos"}
        </h2>

        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredVideos.map((video, idx) => (
              <motion.div key={idx} whileHover={{ scale: 1.05 }}>
                <Card
                  className="bg-gray-900 border-none rounded-md overflow-hidden shadow-md cursor-pointer group"
                  onClick={() => router.push(`/watch/${videos.indexOf(video)}`)}
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="h-36 w-full object-cover group-hover:brightness-75 transition"
                  />
                  <CardContent className="p-2">
                    <h3 className="font-semibold text-sm truncate">
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
        ) : (
          <p className="text-center text-gray-500 mt-20 text-lg">
            No videos found.
          </p>
        )}
      </div>
    </div>
  );
}
