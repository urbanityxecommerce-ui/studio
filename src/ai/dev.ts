import { config } from 'dotenv';
config();

import '@/ai/flows/repurpose-long-videos.ts';
import '@/ai/flows/analyze-competitor-content.ts';
import '@/ai/flows/optimize-video-thumbnails.ts';
import '@/ai/flows/generate-reel-captions.ts';
import '@/ai/flows/generate-content-ideas.ts';
import '@/ai/flows/search-keywords.ts';
import '@/ai/flows/track-keyword-ranks.ts';
import '@/ai/tools/youtube.ts';
