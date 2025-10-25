
import AppLayout from '@/components/layout/app-layout';
import BlogPostClient from '@/components/blog/blog-post-client';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <AppLayout>
      <BlogPostClient slug={params.slug} />
    </AppLayout>
  );
}
