"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // ===============================
  // INIT AUTH + REALTIME
  // ===============================
  useEffect(() => {
    let channel: any;

    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data.user;

      setUser(currentUser);

      if (currentUser) {
        await fetchBookmarks(currentUser.id);

        // Realtime subscription
        channel = supabase
          .channel("bookmarks-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "bookmarks",
              filter: `user_id=eq.${currentUser.id}`,
            },
            () => {
              fetchBookmarks(currentUser.id);
            }
          )
          .subscribe();
      }
    };

    init();

    // Cleanup
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // ===============================
  // FETCH BOOKMARKS
  // ===============================
  const fetchBookmarks = async (userId: string) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) {
      setBookmarks(data || []);
    }
  };

  // ===============================
  // AUTH HANDLERS
  // ===============================
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBookmarks([]);
  };

  // ===============================
  // ADD BOOKMARK
  // ===============================
  const handleAddBookmark = async () => {
    if (!title || !url || !user) return;

    const { error } = await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ]);

    if (!error) {
      setTitle("");
      setUrl("");
      // No manual fetch needed (Realtime handles it)
    }
  };

  // ===============================
  // DELETE BOOKMARK
  // ===============================
  const handleDelete = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    // No manual fetch needed
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-6 p-6">
      {!user ? (
        <button
          onClick={handleLogin}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Login with Google
        </button>
      ) : (
        <>
          <h1 className="text-xl font-semibold">
            Welcome {user.email}
          </h1>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border px-3 py-2 rounded"
            />
            <button
              onClick={handleAddBookmark}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Add
            </button>
          </div>

          <div className="w-full max-w-md">
            {bookmarks.length === 0 && (
              <p className="text-gray-500 text-center">
                No bookmarks yet.
              </p>
            )}

            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex justify-between items-center border p-3 rounded mb-2"
              >
                <div>
                  <p className="font-semibold">{bookmark.title}</p>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm"
                  >
                    {bookmark.url}
                  </a>
                </div>
                <button
                  onClick={() => handleDelete(bookmark.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}
