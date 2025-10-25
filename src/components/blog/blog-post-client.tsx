
'use client';

import { type BlogPost } from '@/lib/placeholder-blog';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp, query, orderBy, doc, arrayUnion } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { format, subDays } from 'date-fns';
import { ArrowLeft, Calendar, Loader2, MessageCircle, Send, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { Logo } from '../icons';

type BlogComment = {
    id?: string;
    userId: string;
    userName: string;
    userAvatar: string | null;
    content: string;
    createdAt: any;
}

export default function BlogPostClient({ post }: { post: BlogPost }) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [displayDate, setDisplayDate] = useState('');
  const [isoDate, setIsoDate] = useState('');

  useEffect(() => {
    // This code runs only on the client, avoiding hydration mismatch
    const date = subDays(new Date(), 3);
    setDisplayDate(format(date, 'MMMM d, yyyy'));
    setIsoDate(date.toISOString());
  }, []);

  const commentsQuery = useMemoFirebase(
    () => post ? query(collection(firestore, 'blogPosts', post.id, 'comments'), orderBy('createdAt', 'asc')) : null,
    [firestore, post]
  );
  const { data: comments, isLoading: areCommentsLoading } = useCollection<BlogComment>(commentsQuery);
  
  const postDocRef = useMemoFirebase(() => post ? doc(firestore, 'blogPosts', post.id) : null, [firestore, post]);
  const { data: postData } = useDoc(postDocRef);


  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !post || !newComment.trim()) return;

    setIsSubmitting(true);
    
    const commentData: BlogComment = {
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      userAvatar: user.photoURL,
      content: newComment,
      createdAt: serverTimestamp(),
    };

    try {
        const commentsCol = collection(firestore, 'blogPosts', post.id, 'comments');
        addDocumentNonBlocking(commentsCol, commentData);
        
        const postRef = doc(firestore, 'blogPosts', post.id);
        updateDocumentNonBlocking(postRef, {
            commenters: arrayUnion(user.uid)
        });

        setNewComment('');
        toast({ title: "Comment Posted!", description: "Your comment has been added." });
    } catch (error) {
        console.error("Error posting comment:", error);
        toast({ variant: 'destructive', title: "Error", description: "Failed to post comment." });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (typeof window === 'undefined' || !post) return;
    
    const currentUrl = window.location.href;

    const shareData = {
      title: post.title,
      text: `Check out this article from CreatorX SEO: ${post.title}`,
      url: currentUrl,
    };
    
    // Use native share if available, otherwise fall back to clipboard
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({ title: "Article Shared!", description: "Thanks for sharing." });
      } catch (error) {
        // This can happen if the user cancels the share. We will fall back to copy.
        console.warn('Native share failed, falling back to clipboard:', error);
        try {
          await navigator.clipboard.writeText(currentUrl);
          toast({ title: "Link Copied!", description: "The article link has been copied to your clipboard." });
        } catch (copyError) {
          console.error('Failed to copy to clipboard:', copyError);
          toast({
            variant: "destructive",
            title: "Could not share or copy",
            description: "There was an error trying to share this article.",
          });
        }
      }
    } else {
        // Fallback for browsers that don't support navigator.share
        try {
          await navigator.clipboard.writeText(currentUrl);
          toast({ title: "Link Copied!", description: "The article link has been copied to your clipboard." });
        } catch (copyError) {
          console.error('Failed to copy to clipboard:', copyError);
          toast({
            variant: "destructive",
            title: "Could not copy link",
            description: "There was an error trying to copy the link.",
          });
        }
    }
  };


  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
       <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>
      </div>
      <article className="space-y-8">
        <header className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                {post.authorName === 'CreatorX' ? (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Logo className="h-4 w-4" />
                  </div>
                ) : (
                  <>
                    <AvatarImage src={`https://picsum.photos/seed/${post.authorName}/40/40`} alt={post.authorName} />
                    <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                  </>
                )}
              </Avatar>
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
          </div>
        </header>

        <Image src={post.coverImageUrl} alt={post.title} width={1200} height={600} className="rounded-lg object-cover aspect-video w-full" />
        
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        
        <Separator />
        
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Join the Conversation</h3>
            <Button variant="outline" onClick={handleShare}><Share2 className="mr-2 h-4 w-4" />Share</Button>
        </div>
        
        {/* Comments Section */}
        <div className="space-y-6">
            {user && (
                <Card>
                    <form onSubmit={handleCommentSubmit}>
                        <CardHeader className='p-4'>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={user.photoURL ?? undefined} />
                                    <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                                </Avatar>
                                <p className='font-semibold'>{user.displayName}</p>
                            </div>
                        </CardHeader>
                        <CardContent className='p-4 pt-0'>
                            <Textarea
                                placeholder="Write your comment here..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[100px]"
                                disabled={isSubmitting}
                            />
                        </CardContent>
                        <CardFooter className='p-4 pt-0'>
                            <Button type="submit" disabled={!newComment.trim() || isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                Post Comment
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            )}
            {!user && !isUserLoading && (
                <Card className="text-center p-6">
                    <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h4 className="mt-4 font-semibold">Log in to join the discussion</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Share your thoughts and connect with other creators.
                    </p>
                    <Button onClick={() => router.push('/login')} className="mt-4">Log In</Button>
                </Card>
            )}

            {areCommentsLoading && <div className='text-center'><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}

            <div className="space-y-4">
                {comments && comments.map(comment => (
                    <Card key={comment.id} className="p-4">
                       <div className="flex items-start gap-4">
                            <Avatar>
                                <AvatarImage src={comment.userAvatar ?? undefined} />
                                <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className='flex-1'>
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">{comment.userName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {comment.createdAt?.toDate ? format(comment.createdAt.toDate(), 'MMM d, yyyy') : 'Just now'}
                                    </p>
                                </div>
                                <p className="mt-1 text-muted-foreground">{comment.content}</p>
                            </div>
                       </div>
                    </Card>
                ))}
                {comments && comments.length === 0 && !areCommentsLoading && (
                     <div className="text-center text-muted-foreground py-8">
                        <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>
        </div>
      </article>
    </div>
  );
}
