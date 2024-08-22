export function isVideoInPlaylists(videoId, videos) {
  if (videos.includes(videoId)) {
    return true;
  }
  return false;
}
