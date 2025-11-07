
import BlogListClient from '@/components/blog/blog-list-client';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <BlogListClient />
      </main>
      <Footer />
    </div>
  );
}
