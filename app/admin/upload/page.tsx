"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AdminLayout from "@/components/AdminLayout";

interface Video {
  title: string;
  description: string;
  link: string; // Always stored as an embed link
  thumbnail: string; // Base64 or object URL
  type: string; // Stream type (Movie, Episode, etc.)
  language: string; // Telugu, Hindi, Tamil, Other
}

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [thumbnail, setThumbnail] = useState<string>("");
  const [type, setType] = useState("Movie"); // default
  const [language, setLanguage] = useState("Telugu"); // ✅ default must match dropdown

  // Normalize old videos in localStorage (replace "English" → "Other")
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("videos") || "[]");
    let updated = false;

    const normalized = existing.map((video: Video) => {
      if (video.language === "English") {
        updated = true;
        return { ...video, language: "Other" };
      }
      return video;
    });

    if (updated) {
      localStorage.setItem("videos", JSON.stringify(normalized));
    }
  }, []);

  // Handle thumbnail upload
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert YouTube watch links -> embed links
  const getEmbedLink = (url: string): string => {
    try {
      if (url.includes("watch?v=")) {
        const videoId = url.split("watch?v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url; // already embed or other platform
    } catch {
      return url;
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const embedLink = getEmbedLink(link);

    const newVideo: Video = {
      title,
      description,
      link: embedLink,
      thumbnail,
      type,
      language,
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem("videos") || "[]");
    existing.push(newVideo);
    localStorage.setItem("videos", JSON.stringify(existing));

    // Reset form
    setTitle("");
    setDescription("");
    setLink("");
    setThumbnail("");
    setType("Movie");
    setLanguage("Telugu");

    alert("✅ Video uploaded successfully!");
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        {/* Title */}
        <Input
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Description */}
        <Textarea
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* YouTube Link */}
        <Input
          placeholder="Video Link (YouTube or Embed link)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />

        {/* Stream Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Stream Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring focus:ring-primary/30"
          >
            <option value="Movie">Movie</option>
            <option value="Episode">Episode</option>
            <option value="Horror">Horror</option>
            <option value="Clip">Clip</option>
            <option value="Trailer">Trailer</option>
            <option value="Action">Action</option>
          </select>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring focus:ring-primary/30"
          >
            <option value="Telugu">Telugu</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Upload Thumbnail</label>
          <Input type="file" accept="image/*" onChange={handleThumbnailChange} />
          {thumbnail && (
            <a
              href={getEmbedLink(link)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={thumbnail}
                alt="Thumbnail Preview"
                className="mt-2 h-32 w-auto rounded-lg border cursor-pointer hover:opacity-80 transition"
              />
            </a>
          )}
        </div>

        <Button type="submit">Upload</Button>
      </form>
    </AdminLayout>
  );
}
