"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ref, onValue, remove, update } from "firebase/database";
import { database } from "@/lib/firebase";

interface Video {
  title: string;
  description: string;
  link: string;
  thumbnailUrl: string;
  type: string;
  language: string;
}

export default function AdminDashboard() {
  const [videos, setVideos] = useState<{ key: string; data: Video }[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterLanguage, setFilterLanguage] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [editingVideo, setEditingVideo] = useState<{ key: string; data: Video } | null>(null);
  const [deleteVideoConfirm, setDeleteVideoConfirm] = useState<{ key: string; data: Video } | null>(null);

  useEffect(() => {
    const videosRef = ref(database, "videos");
    onValue(videosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.entries(data).map(([key, val]) => ({ key, data: val as Video }));
        setVideos(arr);
      } else setVideos([]);
    });
  }, []);

  const deleteVideo = async (key: string) => {
    await remove(ref(database, `videos/${key}`));
    setDeleteVideoConfirm(null);
  };

  const updateVideo = async (key: string, updated: Video) => {
    await update(ref(database, `videos/${key}`), updated);
    setEditingVideo(null);
  };

  const filteredVideos = videos.filter((v) => {
    const matchesTitle = v.data.title.toLowerCase().includes(searchTitle.toLowerCase());
    const matchesType = filterType === "All" || v.data.type === filterType;
    const matchesLang =
      filterLanguage === "All" ||
      (filterLanguage === "Other"
        ? !["Telugu", "Hindi", "Tamil"].includes(v.data.language)
        : v.data.language === filterLanguage);
    return matchesTitle && matchesType && matchesLang;
  });

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          placeholder="Search..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="md:w-1/3 rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="md:w-1/4 rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          <option value="All">All Types</option>
          <option value="Movie">Movie</option>
          <option value="Episode">Episode</option>
          <option value="Horror">Horror</option>
          <option value="Clip">Clip</option>
          <option value="Trailer">Trailer</option>
          <option value="Action">Action</option>
                                  <option value="Song">Song</option>

        </select>
        <select
          value={filterLanguage}
          onChange={(e) => setFilterLanguage(e.target.value)}
          className="md:w-1/4 rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          <option value="All">All Languages</option>
          <option value="Telugu">Telugu</option>
          <option value="Hindi">Hindi</option>
          <option value="Tamil">Tamil</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredVideos.map(({ key, data }, idx) => (
          <Card
            key={idx}
            className="hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer overflow-hidden rounded-xl"
          >
            <CardContent className="p-0">
              <img src={data.thumbnailUrl} alt={data.title} className="w-full h-40 object-cover rounded-t-xl" />
              <div className="p-4">
                <h2 className="text-lg font-semibold truncate">{data.title}</h2>
                <p className="text-sm text-gray-500 line-clamp-2">{data.description}</p>
                <p className="text-xs mt-1 text-gray-400">{data.type} | {data.language}</p>
                <div className="flex gap-2 mt-3">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 active:scale-95 active:brightness-90 text-white transition-transform duration-150"
                    onClick={() => setSelectedVideo(data)}
                  >
                    Preview
                  </Button>
                  <Button
                    className="bg-yellow-500 hover:bg-yellow-600 active:scale-95 active:brightness-90 text-white transition-transform duration-150"
                    onClick={() => setEditingVideo({ key, data })}
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 active:scale-95 active:brightness-90 text-white transition-transform duration-150"
                    onClick={() => setDeleteVideoConfirm({ key, data })}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-3xl w-full relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl active:scale-95 transition-transform duration-150"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedVideo.title}</h2>
            <iframe src={selectedVideo.link} className="w-full h-96 rounded-lg mb-4" allowFullScreen />
            <p className="text-gray-700">{selectedVideo.description}</p>
            <p className="text-sm font-medium text-gray-500 mt-2">{selectedVideo.type} | {selectedVideo.language}</p>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-black p-6 rounded-xl shadow-xl max-w-lg w-full overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={() => setEditingVideo(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl active:scale-95 transition-transform duration-150"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-white">Edit Video</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const updated: Video = {
                  title: (form.elements.namedItem("title") as HTMLInputElement).value,
                  description: (form.elements.namedItem("description") as HTMLInputElement).value,
                  link: (form.elements.namedItem("link") as HTMLInputElement).value,
                  thumbnailUrl: (form.elements.namedItem("thumbnailUrl") as HTMLInputElement).value,
                  type: (form.elements.namedItem("type") as HTMLSelectElement).value,
                  language: (form.elements.namedItem("language") as HTMLSelectElement).value || "Other",
                };
                updateVideo(editingVideo.key, updated);
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white mb-1">Title</label>
                <input
                  id="title"
                  name="title"
                  defaultValue={editingVideo.data.title}
                  placeholder="Title"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-1">Description</label>
                <input
                  id="description"
                  name="description"
                  defaultValue={editingVideo.data.description}
                  placeholder="Description"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label htmlFor="link" className="block text-sm font-medium text-white mb-1">Video Link</label>
                <input
                  id="link"
                  name="link"
                  defaultValue={editingVideo.data.link}
                  placeholder="Video Link"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-white mb-1">Thumbnail URL</label>
                <input
                  id="thumbnailUrl"
                  name="thumbnailUrl"
                  defaultValue={editingVideo.data.thumbnailUrl}
                  placeholder="Thumbnail URL"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-white mb-1">Type</label>
                <select
                  id="type"
                  name="type"
                  defaultValue={editingVideo.data.type}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-600"
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

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-white mb-1">Language</label>
                <select
                  id="language"
                  name="language"
                  defaultValue={editingVideo.data.language}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="Telugu">Telugu</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 active:scale-95 active:brightness-90 text-white transition-transform duration-150"
              >
                Save Changes
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteVideoConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Video</h2>
            <p className="text-gray-700">Are you sure you want to delete <b>{deleteVideoConfirm.data.title}</b>?</p>
            <div className="flex gap-4 mt-4 justify-center">
              <Button
                className="bg-red-600 hover:bg-red-700 active:scale-95 active:brightness-90 text-white transition-transform duration-150"
                onClick={() => deleteVideo(deleteVideoConfirm.key)}
              >
                Delete
              </Button>
              <Button
                className="bg-gray-300 hover:bg-gray-400 active:scale-95 active:brightness-90 text-gray-900 transition-transform duration-150"
                onClick={() => setDeleteVideoConfirm(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
