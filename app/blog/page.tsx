import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';
import { getAllBlogPosts } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: 'Blog — AI Content Creation Guides & Tutorials',
  description:
    'Tips, tutorials, and guides on AI video generation, AI music, voice synthesis, and content creation with MotionForce.',
  openGraph: {
    title: 'MotionForce Blog — AI Content Creation Guides',
    description: 'Tips, tutorials, and guides on AI video generation, AI music, voice synthesis, and content creation.',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <div className="container mx-auto px-6 py-16 max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Blog</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Guides & Tutorials</h1>
          <p className="text-zinc-400 text-lg max-w-xl">
            Learn how to create stunning AI content — video, music, voice, and more.
          </p>
        </div>

        {/* Featured post */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group block rounded-2xl border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors mb-8"
          >
            <div className={`h-56 md:h-72 bg-gradient-to-br ${featured.coverGradient} flex items-end p-8`}>
              <span className="text-xs font-semibold bg-white/10 border border-white/20 text-white px-2.5 py-1 rounded-full">
                {featured.category}
              </span>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
                <span>{featured.readingTime}</span>
                <span>·</span>
                <time dateTime={featured.publishedAt}>
                  {new Date(featured.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </time>
              </div>
              <h2 className="text-2xl font-bold mb-3 group-hover:text-zinc-200 transition-colors">
                {featured.title}
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{featured.description}</p>
            </div>
          </Link>
        )}

        {/* Post grid */}
        {rest.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-xl border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors flex flex-col"
              >
                <div className={`h-36 bg-gradient-to-br ${post.coverGradient} flex items-end p-5`}>
                  <span className="text-xs font-semibold bg-white/10 border border-white/20 text-white px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-zinc-600 mb-2.5">
                    <span>{post.readingTime}</span>
                    <span>·</span>
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </time>
                  </div>
                  <h3 className="font-semibold text-sm leading-snug mb-2 group-hover:text-zinc-200 transition-colors flex-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2">{post.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
