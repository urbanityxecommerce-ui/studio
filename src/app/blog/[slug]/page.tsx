
import AppLayout from '@/components/layout/app-layout';
import BlogPostClient from '@/components/blog/blog-post-client';
import { placeholderBlogPosts } from '@/lib/placeholder-blog';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

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

// This function generates dynamic metadata for each blog post page.
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPost(params.slug);

  if (!post) {
    return {
      title: 'Not Found',
      description: 'The page you are looking for does not exist.',
    };
  }

  return {
    title: `${post.title} | CreatorX SEO`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // Fetch the post on the server.
  const post = getPost(params.slug);

  // If the post doesn't exist, show a 404 page.
  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    name: post.title,
    description: post.excerpt,
    image: post.coverImageUrl,
    author: {
      '@type': 'Organization',
      name: post.authorName,
      logo: {
        '@type': 'ImageObject',
        url: 'https://creatorx-seo.web.app/icons/icon-192x192.png' // Replace with your actual logo URL
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'CreatorX SEO',
      logo: {
        '@type': 'ImageObject',
        url: 'https://creatorx-seo.web.app/icons/icon-192x192.png' // Replace with your actual logo URL
      }
    },
    datePublished: post.createdAt,
    dateModified: post.createdAt, // Assuming created and modified are same for placeholders
  };

  // Pass the post data to the client component for rendering.
  return (
    <AppLayout>
      {/* Add JSON-LD to the head of the page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient post={post} />
    </AppLayout>
  );
}
