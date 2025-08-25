"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/AdminLayout";
import { X, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Video {
  title: string;
  description: string;
  link: string;
  thumbnail: string;
  type: string;
  language: string;
}

export default function AdminDashboard() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterLanguage, setFilterLanguage] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [deleteVideoConfirm, setDeleteVideoConfirm] = useState<Video | null>(null);

  // Load videos from localStorage and normalize language
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("videos") || "[]");
    const normalized = stored.map((v: any) => ({
      ...v,
      language: v.language || "Other",
    }));
    setVideos(normalized);
  }, []);

  // Save videos to localStorage
  const saveVideos = (updated: Video[]) => {
    setVideos(updated);
    localStorage.setItem("videos", JSON.stringify(updated));
  };

  // Delete video
  const deleteVideo = (video: Video) => {
    const updated = videos.filter((v) => v !== video);
    saveVideos(updated);
    setDeleteVideoConfirm(null);
    setSelectedVideo(null);
  };

  // Update video
  const updateVideo = (updatedVideo: Video) => {
    const updated = videos.map((v) => (v === editingVideo ? updatedVideo : v));
    saveVideos(updated);
    setEditingVideo(null);
  };

  // Filter videos
  const filteredVideos = videos.filter((video) => {
    const matchesTitle = video.title.toLowerCase().includes(searchTitle.toLowerCase());
    const matchesType = filterType === "All" || video.type === filterType;
    const matchesLanguage =
      filterLanguage === "All" ||
      (filterLanguage === "Other"
        ? !["Telugu", "Hindi", "Tamil"].includes(video.language)
        : video.language === filterLanguage);
    return matchesTitle && matchesType && matchesLanguage;
  });

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search by title..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="md:w-1/3"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="md:w-1/4 rounded-xl border border-border bg-card px-3 py-2 text-sm"
        >
          <option value="All">All Types</option>
          <option value="Movie">Movie</option>
          <option value="Episode">Episode</option>
          <option value="Horror">Horror</option>
          <option value="Clip">Clip</option>
          <option value="Trailer">Trailer</option>
          <option value="Action">Action</option>
        </select>
        <select
          value={filterLanguage}
          onChange={(e) => setFilterLanguage(e.target.value)}
          className="md:w-1/4 rounded-xl border border-border bg-card px-3 py-2 text-sm"
        >
          <option value="All">All Languages</option>
          <option value="Telugu">Telugu</option>
          <option value="Hindi">Hindi</option>
          <option value="Tamil">Tamil</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredVideos.map((video, index) => (
            <Card key={index} className="hover:shadow-lg transition relative">
              <CardContent className="p-4">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h2 className="text-lg font-semibold">{video.title}</h2>
                <p className="text-sm text-gray-500 line-clamp-2">{video.description}</p>
                <p className="text-xs mt-1 text-primary font-medium">
                  {video.type} | {video.language}
                </p>

                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => setSelectedVideo(video)} className="bg-blue-600 hover:bg-blue-700">
                    Preview
                  </Button>
                  <Button size="sm" onClick={() => setEditingVideo(video)} className="bg-yellow-500 hover:bg-yellow-600">
                    <Pencil size={16} />
                  </Button>
                  <Button size="sm" onClick={() => setDeleteVideoConfirm(video)} className="bg-red-600 hover:bg-red-700">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-3xl w-full relative">
            <button onClick={() => setSelectedVideo(null)} className="absolute top-2 right-2 text-gray-700 hover:text-red-500"><X size={24} /></button>
            <h2 className="text-xl font-bold mb-2">{selectedVideo.title}</h2>
            <iframe src={selectedVideo.link} className="w-full h-96 rounded" allowFullScreen></iframe>
            <p className="mt-2 text-gray-600">{selectedVideo.description}</p>
            <p className="text-xs text-primary font-medium">{selectedVideo.type} | {selectedVideo.language}</p>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
            <button onClick={() => setEditingVideo(null)} className="absolute top-2 right-2 text-gray-700 hover:text-red-500"><X size={24} /></button>
            <h2 className="text-xl font-bold mb-4">Edit Video</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const updated: Video = {
                  title: (form.elements.namedItem("title") as HTMLInputElement).value,
                  description: (form.elements.namedItem("description") as HTMLInputElement).value,
                  link: (form.elements.namedItem("link") as HTMLInputElement).value,
                  thumbnail: (form.elements.namedItem("thumbnail") as HTMLInputElement).value,
                  type: (form.elements.namedItem("type") as HTMLSelectElement).value,
                  language: (form.elements.namedItem("language") as HTMLSelectElement).value || "Other",
                };
                updateVideo(updated);
              }}
              className="space-y-3"
            >
              <Input name="title" defaultValue={editingVideo.title} placeholder="Title" />
              <Input name="description" defaultValue={editingVideo.description} placeholder="Description" />
              <Input name="link" defaultValue={editingVideo.link} placeholder="Video Link" />
              <Input name="thumbnail" defaultValue={editingVideo.thumbnail} placeholder="Thumbnail URL" />
              <select name="type" defaultValue={editingVideo.type} className="w-full border rounded p-2">
                <option value="Movie">Movie</option>
                <option value="Episode">Episode</option>
                <option value="Horror">Horror</option>
                <option value="Clip">Clip</option>
                <option value="Trailer">Trailer</option>
                <option value="Action">Action</option>
              </select>
              <select name="language" defaultValue={editingVideo.language} className="w-full border rounded p-2">
                <option value="Telugu">Telugu</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
                <option value="Other">Other</option>
              </select>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Save Changes</Button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteVideoConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative text-center shadow-xl">
            <X
              size={24}
              className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-red-600"
              onClick={() => setDeleteVideoConfirm(null)}
            />
            <div className="flex flex-col items-center gap-4">
              <div className="bg-red-100 rounded-full p-4">
                <Trash2 size={32} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Delete Video</h2>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold">{deleteVideoConfirm.title}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-4 mt-4 w-full justify-center">
                <Button
                  className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full"
                  onClick={() => deleteVideo(deleteVideoConfirm)}
                >
                  Delete
                </Button>
                <Button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-full"
                  onClick={() => setDeleteVideoConfirm(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
