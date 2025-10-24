'use server';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

function extractVideoId(url: string) {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

function extractChannelId(url: string) {
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/channel\/([\w-]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/c\/([\w-]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/user\/([\w-]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([\w-]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
}


export const getYoutubeChannelAndVideoDetails = ai.defineTool(
  {
    name: 'getYoutubeChannelAndVideoDetails',
    description: 'Get details about a YouTube channel or video from a URL.',
    inputSchema: z.string(),
    outputSchema: z.object({
        videoTitles: z.array(z.string()),
        videoTags: z.array(z.string()),
    }),
  },
  async (url) => {
    let channelId: string | null = null;
    const videoId = extractVideoId(url);

    if (videoId) {
        try {
            const videoResponse = await youtube.videos.list({
                part: ['snippet'],
                id: [videoId],
            });
            if (videoResponse.data.items && videoResponse.data.items.length > 0) {
                channelId = videoResponse.data.items[0].snippet?.channelId ?? null;
            }
        } catch (error) {
            console.error('Error fetching video details:', error);
            throw new Error('Failed to retrieve video details from YouTube API.');
        }
    } else {
        channelId = extractChannelId(url);
        if (!channelId) {
            // Handle @username style channels
            const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([\w-]+)/);
            if (match && match[1]) {
                try {
                     const searchResponse = await youtube.search.list({
                        part: ['snippet'],
                        q: match[1],
                        type: ['channel'],
                        maxResults: 1
                    });
                     if (searchResponse.data.items && searchResponse.data.items.length > 0) {
                        channelId = searchResponse.data.items[0].snippet?.channelId ?? null;
                    }
                } catch(error) {
                    console.error('Error fetching channel details by username:', error);
                    throw new Error('Failed to retrieve channel details by username from YouTube API.');
                }
            }
        }
    }

    if (!channelId) {
        throw new Error('Could not extract a valid YouTube Channel ID or Video ID from the URL.');
    }

    try {
        // Get channel uploads playlist
        const channelResponse = await youtube.channels.list({
            part: ['contentDetails'],
            id: [channelId],
        });

        const uploadsPlaylistId = channelResponse.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
        if (!uploadsPlaylistId) {
            throw new Error('Could not find the uploads playlist for the channel.');
        }

        // Get videos from the uploads playlist
        const playlistItemsResponse = await youtube.playlistItems.list({
            part: ['contentDetails'],
            playlistId: uploadsPlaylistId,
            maxResults: 20, // Fetch more videos to get a better sample
        });

        const videoIds = playlistItemsResponse.data.items?.map(item => item.contentDetails?.videoId).filter((id): id is string => !!id) ?? [];

        if (videoIds.length === 0) {
             return { videoTitles: [], videoTags: [] };
        }

        // Get video details (including tags)
        const videosResponse = await youtube.videos.list({
            part: ['snippet', 'statistics'],
            id: videoIds,
        });

        const videos = videosResponse.data.items ?? [];
        
        // Sort by view count to find top videos
        videos.sort((a, b) => parseInt(b.statistics?.viewCount ?? '0', 10) - parseInt(a.statistics?.viewCount ?? '0', 10));

        const videoTitles = videos.map(video => video.snippet?.title).filter((title): title is string => !!title);
        const allTags = videos.flatMap(video => video.snippet?.tags ?? []);

        return { videoTitles, videoTags: Array.from(new Set(allTags)) }; // Return unique tags
    } catch (error) {
      console.error('Error fetching data from YouTube API:', error);
      throw new Error('An error occurred while fetching data from the YouTube API.');
    }
  }
);
