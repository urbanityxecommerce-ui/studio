
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorName: string;
  coverImageUrl: string;
  tags: string[];
  createdAt: string;
};

export const placeholderBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: '5 Secrets to Going Viral on YouTube in 2025',
    slug: '5-secrets-to-going-viral-on-youtube-in-2025',
    excerpt: 'Unlock the strategies that top creators are using to dominate the YouTube algorithm. From thumbnail psychology to title wizardry, we break it down.',
    content: `
      <p>Going viral on YouTube isn't about luck; it's about strategy. In the ever-evolving landscape of 2025, the algorithm favors creators who understand viewer psychology and content structure. Here are five powerful secrets to boost your chances of creating the next viral hit.</p>
      
      <h3 class="font-bold text-2xl mt-6 mb-3">1. The "Open Loop" Title and Thumbnail</h3>
      <p>Your click-through rate (CTR) is the first gatekeeper to virality. Create a title that poses a question or starts a story, and a thumbnail that adds to the mystery without giving away the answer. For example, a title like "I Tried the 'World's Spiciest' Noodle..." paired with a thumbnail of your shocked face creates an "open loop" that viewers feel compelled to close by clicking.</p>

      <h3 class="font-bold text-2xl mt-6 mb-3">2. Master the First 15 Seconds</h3>
      <p>Audience retention is king. The first 15 seconds of your video must do three things: confirm the promise of the title, introduce a high-stakes hook, and provide a flash of what's to come (a "micro-montage"). Don't waste time with long intros. Get straight to the action and prove to the viewer they made the right choice.</p>

      <h3 class="font-bold text-2xl mt-6 mb-3">3. Emotion is the Ultimate Share Trigger</h3>
      <p>People share content that makes them feel something. Whether it's awe, laughter, inspiration, or even anger, a strong emotional response is the fuel for sharing. Structure your story to build towards an emotional peak. Show vulnerability, celebrate a victory, or tell a joke that genuinely lands. A video with a strong emotional core is a video that gets shared.</p>

      <h3 class="font-bold text-2xl mt-6 mb-3">4. Ride the "Trend Wave" with a Unique Angle</h3>
      <p>Don't just copy a trend; add to it. Use tools like our Competitor Analysis feature to see what's popular, but find a unique perspective that nobody else is covering. Can you do a popular challenge with a hilarious twist? Can you debunk a common myth related to a trending topic? This "trend-jacking" with a unique value proposition is a shortcut to discoverability.</p>

      <h3 class="font-bold text-2xl mt-6 mb-3">5. Craft a "Comment-Worthy" Moment</h3>
      <p>The YouTube algorithm loves engagement, especially comments. Intentionally add a specific point in your video designed to generate discussion. Ask a direct question, state a slightly controversial opinion (that you can back up!), or create a "choose your side" scenario. For example, end a segment with, "I think this is the worst way to do it, but let me know what you think in the comments." This gives your viewers a clear call to engage.</p>
    `,
    authorName: 'Alex Cruz',
    coverImageUrl: 'https://picsum.photos/seed/youtube-viral/1200/600',
    tags: ['YouTube', 'SEO', 'Growth Hacking'],
    createdAt: '2024-07-20T10:00:00Z',
  },
  {
    id: '2',
    title: 'The Ultimate Guide to Instagram Reel SEO',
    slug: 'the-ultimate-guide-to-instagram-reel-seo',
    excerpt: 'Stop guessing and start ranking. This guide covers everything from keyword-infused captions to audio trends that will get your Reels discovered.',
    content: `
      <p>Instagram is no longer just a photo-sharing app; it's a search engine. If you're not optimizing your Reels for discovery, you're leaving views on the table. This guide will turn you into an Instagram Reel SEO pro.</p>
      
      <h3 class="font-bold text-2xl mt-6 mb-3">1. Keywords are Your Best Friend</h3>
      <p>Treat your caption like a mini blog post. Instagram indexes the words in your caption, so your first line should be a clear, keyword-rich description of your video's content. For example, instead of "Morning vibes," write "My 5-minute healthy breakfast recipe for busy mornings." Use our Reel SEO tool to generate even more ideas.</p>

      <h3 class="font-bold text-2xl mt-6 mb-3">2. Use On-Screen Text Strategically</h3>
      <p>Many users watch Reels with the sound off. Use clear, bold on-screen text to convey your message. Even better, Instagram's AI can "read" this text, which helps it understand and categorize your content. Make sure the text is a summary of your key point.</p>

      <h3 class="font-bold text-2xl mt-6 mb-3">3. The Power of Trending (and Niche) Audio</h3>
      <p>Using trending audio can give you a quick boost, but don't ignore niche sounds. Find audio that is popular within your specific community. When a user clicks on that audio, your Reel will be among the videos shown, giving you highly targeted visibility.</p>

      <h3 class="font-bold text-2xl mt-6 mb-3">4. Hashtags: Quality Over Quantity</h3>
      <p>The old "30 hashtag" rule is dead. Aim for 3-5 highly relevant hashtags. Think like a user: what would they search for to find this video? Include a mix of broad tags (e.g., #contentstrategy) and niche tags (e.g., #youtubetipsforbeginners).</p>

      <h3 class="font-bold text-2xl mt-6 mb-3">5. Your Cover Photo Matters</h3>
      <p>Your Reel cover is what appears on your profile grid and the explore page. It should be high-quality, intriguing, and ideally have text that clearly states the video's value proposition (e.g., "How to Get 1,000 Followers"). Use our Thumbnail Optimizer to get ideas for your Reel covers too!</p>
    `,
    authorName: 'Maria Garcia',
    coverImageUrl: 'https://picsum.photos/seed/instagram-reel/1200/600',
    tags: ['Instagram', 'Reels', 'Social Media'],
    createdAt: '2024-07-18T14:30:00Z',
  },
   {
    id: '3',
    title: 'Competitor Analysis: How to Ethically Steal What Works',
    slug: 'competitor-analysis-how-to-ethically-steal-what-works',
    excerpt: 'Your competitors are giving you a free roadmap to success. Learn how to analyze their content to find gaps, identify winning formulas, and outrank them.',
    content: `
      <p>Why start from scratch when your competitors have already spent time and money figuring out what your audience wants? Ethical competitor analysis isn't about copying; it's about learning, adapting, and improving.</p>
      
      <h3 class="font-bold text-2xl mt-6 mb-3">1. Identify Their "Greatest Hits"</h3>
      <p>Use our Competitor Analysis tool to find your competitor's top 5-10 performing videos. These are your starting point. Don't just look at the topic; analyze the format. Are they 'how-to' videos? Are they listicles? Are they vlogs? This tells you what format resonates with your shared audience.</p>

      <h3 class="font-bold text-2xl mt-6 mb-3">2. Decode Their Headline and Thumbnail Formula</h3>
      <p>Look for patterns. Do they always use numbers in their titles? Do they use bright, high-contrast colors in their thumbnails? Do they always show a face with an exaggerated emotion? These aren't accidents. They are part of a formula you can adapt for your own content.</p>

      <h3 class="font-bold text-2xl mt-6 mb-3">3. Find the "Content Gaps"</h3>
      <p>What questions are left unanswered in their top videos? Read the comments! Viewers will often tell you exactly what they wanted to see more of. For example, if a competitor's video is "5 Best Laptops for Students," you can create a follow-up video on "The 5 WORST Laptops for Students" or "How to Choose the Right Student Laptop (A Deeper Dive)."</p>

      <h3 class="font-bold text-2xl mt-6 mb-3">4. Analyze Their Tagging Strategy</h3>
      <p>Tags help YouTube and Instagram categorize content. Look at the common tags your competitors use. This gives you a direct insight into the keywords they are targeting. You can use these as a starting point for your own keyword research, finding less competitive alternatives where you can rank faster.</p>

      <h3 class="font-bold text-2xl mt-6 mb-3">5. "Level Up" Their Content</h3>
      <p>The final step is to take what you've learned and do it better. Can you make a video that's more in-depth? Better produced? Funnier? More emotionally resonant? If their video is "Top 5 Tips," you make "The Ultimate 10-Step Guide." This is how you don't just compete—you dominate.</p>
    `,
    authorName: 'David Chen',
    coverImageUrl: 'https://picsum.photos/seed/competitor-analysis/1200/600',
    tags: ['Strategy', 'SEO', 'Analysis'],
    createdAt: '2024-07-15T09:00:00Z',
  },
];
