"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AdminLayout from "@/components/AdminLayout";
import { ref, push, set } from "firebase/database";
import { database } from "../../../lib/firebase";

interface Video {
  title: string;
  description: string;
  link: string;
  thumbnailUrl: string;
  type: string;
  language: string;
  series?: string; // optional
}

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [type, setType] = useState("Movie");
  const [language, setLanguage] = useState("Telugu");
  const [series, setSeries] = useState(""); // optional

  const getEmbedLink = (url: string) => {
    if (url.includes("watch?v=")) {
      const videoId = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const embedLink = getEmbedLink(link);

    const newVideo: Video = {
      title,
      description,
      link: embedLink,
      thumbnailUrl,
      type,
      language,
      ...(series && { series }), // only add if not empty
    };

    try {
      const videosRef = ref(database, "videos");
      const newVideoRef = push(videosRef);
      await set(newVideoRef, newVideo);

      alert("✅ Video uploaded successfully!");
      setTitle("");
      setDescription("");
      setLink("");
      setThumbnailUrl("");
      setType("Movie");
      setLanguage("Telugu");
      setSeries(""); // reset
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed!");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <Input
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Textarea
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <Input
          placeholder="Video Link (YouTube or Embed link)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Stream Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border bg-card px-3 py-2 text-sm"
          >
            <option value="Movie">Movie</option>
            <option value="Episode">Episode</option>
            <option value="Horror">Horror</option>
            <option value="Clip">Clip</option>
            <option value="Trailer">Trailer</option>
            <option value="Action">Action</option>
            <option value="Song">Song</option>
          </select>
        </div>

        {/* Series field is ALWAYS visible, optional */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Series Name (optional)
          </label>
          <Input
            placeholder="Enter series name (e.g. Law Firm Battles)"
            value={series}
            onChange={(e) => setSeries(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-lg border bg-card px-3 py-2 text-sm"
          >
            <option value="Telugu">Telugu</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>
            <option value="Korean">Korean</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Thumbnail Image URL
          </label>
          <Input
            type="url"
            placeholder="Paste thumbnail image URL (e.g. https://example.com/image.jpg)"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            required
          />
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt="Thumbnail Preview"
              className="mt-2 h-32 w-auto rounded-lg border"
            />
          )}
        </div>

        <Button type="submit">Upload</Button>
      </form>
    </AdminLayout>
  );
}
