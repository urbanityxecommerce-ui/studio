
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { placeholderBlogPosts } from '@/lib/placeholder-blog';
import { ArrowRight, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format, subDays } from 'date-fns';
import { useEffect, useState } from 'react';

export default function BlogListClient() {
  const [displayDate, setDisplayDate] = useState('');
  const [isoDate, setIsoDate] = useState('');

  useEffect(() => {
    // This code runs only on the client, avoiding hydration mismatch
    const date = subDays(new Date(), 3);
    setDisplayDate(format(date, 'MMM d, yyyy'));
    setIsoDate(date.toISOString());
  }, []);
  
  const getImageHint = (tags: string[]) => {
    if (tags.includes('YouTube')) return 'youtube growth';
    if (tags.includes('Instagram')) return 'instagram seo';
    if (tags.includes('Strategy')) return 'business strategy';
    return 'content creation';
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">CreatorX SEO Blog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your go-to resource for the latest strategies in content creation, SEO, and audience growth.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {placeholderBlogPosts.map((post) => (
          <Card key={post.slug} className="flex flex-col overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            <Link href={`/blog/${post.slug}`} className="block">
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
                data-ai-hint={getImageHint(post.tags)}
              />
            </Link>
            <CardHeader>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
              <CardTitle className="mt-4 text-xl tracking-tight">
                <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{post.excerpt}</CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.authorName}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {displayDate ? (
                        <time dateTime={isoDate}>{displayDate}</time>
                    ) : (
                        <span>Loading...</span>
                    )}
                </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
