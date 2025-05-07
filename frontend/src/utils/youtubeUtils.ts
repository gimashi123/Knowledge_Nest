/**
 * Extracts the YouTube video ID from various YouTube URL formats
 * @param url YouTube URL
 * @returns Video ID or null if not a valid YouTube URL
 */
export function extractYoutubeVideoId(url: string | undefined): string | null {
  if (!url) return null;
  
  // Regular expressions to match different YouTube URL formats
  const patterns = [
    // Standard URL: https://www.youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\?feature=player_embedded&v=)([^#\&\?]*).*/,
    // Short URL: https://youtu.be/VIDEO_ID
    /youtu\.be\/([^#\&\?]*).*/,
    // Embed URL: https://www.youtube.com/embed/VIDEO_ID
    /youtube\.com\/embed\/([^#\&\?]*).*/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Gets the YouTube thumbnail URL for a given video ID
 * @param videoId YouTube video ID
 * @param quality Thumbnail quality (default, medium, high, standard, maxres)
 * @returns Thumbnail URL
 */
export function getYoutubeThumbnailUrl(videoId: string | null, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'hq'): string | null {
  if (!videoId) return null;
  
  // YouTube thumbnail URL format
  // Available qualities: default, hqdefault, mqdefault, sddefault, maxresdefault
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
}

/**
 * Validates if a string is a YouTube URL
 * @param url URL to validate
 * @returns Boolean indicating if it's a valid YouTube URL
 */
export function isYoutubeUrl(url: string | undefined): boolean {
  return !!extractYoutubeVideoId(url);
}

/**
 * Gets embedded YouTube URL from video ID
 * @param videoId YouTube video ID
 * @returns Embedded URL for the video
 */
export function getYoutubeEmbedUrl(videoId: string | null): string | null {
  if (!videoId) return null;
  
  return `https://www.youtube.com/embed/${videoId}`;
} 