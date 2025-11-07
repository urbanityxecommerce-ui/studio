'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons';
import { usePathname } from 'next/navigation';

const footerLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-and-conditions', label: 'Terms & Conditions' },
  { href: '/refund-policy', label: 'Refund Policy' },
];

export function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname.includes('/login') || pathname.includes('/signup');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className={`flex flex-col items-center gap-8 ${isAuthPage ? '' : 'sm:flex-row sm:justify-between'}`}>
            <div className="flex flex-col items-center gap-4 sm:items-start">
              <Link href="/" className="flex items-center gap-2">
                <Logo />
                <span className="font-semibold">CreatorX SEO</span>
              </Link>
              <p className="max-w-xs text-center text-sm text-muted-foreground sm:text-left">
                The ultimate SEO toolkit for YouTubers and Instagram creators.
              </p>
            </div>
            { !isAuthPage &&
              <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-3 sm:text-left">
                <div>
                  <h3 className="font-semibold">Tools</h3>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li><Link href="/" className="text-muted-foreground hover:text-primary">Content Ideas</Link></li>
                    <li><Link href="/keyword-research" className="text-muted-foreground hover:text-primary">Keyword Research</Link></li>
                    <li><Link href="/competitor-analysis" className="text-muted-foreground hover:text-primary">Competitor Analysis</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold">Resources</h3>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
                    <li><Link href="/help" className="text-muted-foreground hover:text-primary">Help & FAQ</Link></li>
                    <li><Link href="/feedback" className="text-muted-foreground hover:text-primary">Feedback</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold">Legal</h3>
                  <ul className="mt-4 space-y-2 text-sm">
                    {footerLinks.slice(2).map(link => (
                      <li key={link.href}><Link href={link.href} className="text-muted-foreground hover:text-primary">{link.label}</Link></li>
                    ))}
                  </ul>
                </div>
              </div>
            }
          </div>
          <div className="mt-8 border-t pt-8">
             <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between">
                <p className="text-sm text-muted-foreground">&copy; {year} CreatorX SEO. All rights reserved.</p>
                 <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                    {footerLinks.slice(0, 2).map(link => (
                        <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                            {link.label}
                        </Link>
                    ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
