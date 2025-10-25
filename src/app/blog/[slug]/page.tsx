
import AppLayout from '@/components/layout/app-layout';
import BlogPostClient from '@/components/blog/blog-post-client';
import { placeholderBlogPosts } from '@/lib/placeholder-blog';
import { notFound } from 'next/navigation';

// This function tells Next.js which blog post pages to build at build time.
export async function generateStaticParams() {
  return placeholderBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// This function gets the data for a specific post on the server.
const getPost = (slug: string) => {
    const post = placeholderBlogPosts.find((p) => p.slug === slug);
    return post;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // Fetch the post on the server.
  const post = getPost(params.slug);

  // If the post doesn't exist, show a 404 page.
  if (!post) {
    notFound();
  }

  // Pass the post data to the client component for rendering.
  return (
    <AppLayout>
      <BlogPostClient post={post} />
    </AppLayout>
  );
}
