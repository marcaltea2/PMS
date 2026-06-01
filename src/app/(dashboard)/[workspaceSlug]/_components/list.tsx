"use client";

import { api } from "~/trpc/react";

export function ListPost() {
  const [posts] = api.post.getAll.useSuspenseQuery();

  return (
    <div className="w-full max-w-xs space-y-4">
      <h1 className="text-2xl font-bold">POSTS</h1>

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded border p-3"
            >
              <h2 className="font-semibold">
                {post.name}
              </h2>

              <p className="text-sm text-gray-500">
                ID: {post.id}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}