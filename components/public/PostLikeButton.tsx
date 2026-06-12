"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function PostLikeButton({
  authenticated,
  liked,
  likeCount,
  postId
}: {
  authenticated: boolean;
  liked: boolean;
  likeCount: number;
  postId: string;
}) {
  const [animating, setAnimating] = useState(false);
  const [localLiked, setLocalLiked] = useState(liked);
  const [localCount, setLocalCount] = useState(likeCount);

  const handleLike = async () => {
    if (!authenticated) {
      toast.error("Connectez-vous pour liker un post.");
      return;
    }

    setAnimating(true);

    try {
      const response = await fetch("/api/admin/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId })
      });

      if (!response.ok) {
        throw new Error("Like failed");
      }

      const data = await response.json();
      setLocalLiked(data.liked);
      setLocalCount(data.likeCount);
    } catch {
      toast.error("Action impossible.");
    } finally {
      setAnimating(false);
    }
  };

  return (
    <button
      className="group flex items-center gap-1.5 transition-colors"
      disabled={animating}
      onClick={handleLike}
      type="button"
    >
      <Heart
        className={`h-4 w-4 transition-all ${
          localLiked
            ? "fill-dentova-magenta text-dentova-magenta"
            : "text-dentova-navy-300 group-hover:text-dentova-magenta"
        } ${animating ? "animate-pulse" : ""}`}
      />
      <span
        className={`text-xs font-semibold ${
          localLiked ? "text-dentova-magenta" : "text-dentova-navy-400"
        }`}
      >
        {localCount}
      </span>
    </button>
  );
}
