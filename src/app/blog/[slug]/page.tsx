
import AppLayout from '@/components/layout/app-layout';
import BlogPostClient from '@/components/blog/blog-post-client';
import { placeholderBlogPosts } from '@/lib/placeholder-blog';
import { notFound } from 'next/navigation';

// This function tells Next.js which blog post pages to build.
export async function generateStaticParams() {
  return placeholderBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = placeholderBlogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <AppLayout>
      <BlogPostClient post={post} />
    </AppLayout>
  );
}
