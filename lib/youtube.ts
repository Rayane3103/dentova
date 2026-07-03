export function getYouTubeVideoId(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      return normalizeYouTubeId(url.pathname.split("/").filter(Boolean)[0]);
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      if (url.pathname === "/watch") {
        return normalizeYouTubeId(url.searchParams.get("v"));
      }

      const [section, id] = url.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(section)) {
        return normalizeYouTubeId(id);
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeEmbedUrl(value?: string | null) {
  const videoId = getYouTubeVideoId(value);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

function normalizeYouTubeId(value?: string | null) {
  if (!value || !/^[a-zA-Z0-9_-]{11}$/.test(value)) {
    return null;
  }

  return value;
}
