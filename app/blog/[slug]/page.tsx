import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';
import { getAllBlogPosts, getBlogPost } from '@/lib/blog-posts';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author.name }],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `https://motionforce.io/blog/${post.slug}`,
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const allPosts = getAllBlogPosts();
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "MotionForce",
      url: "https://motionforce.io",
    },
    keywords: post.tags.join(", "),
    url: `https://motionforce.io/blog/${post.slug}`,
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      {/* Cover */}
      <div className={`h-64 md:h-80 bg-gradient-to-br ${post.coverGradient} relative`}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative container mx-auto px-6 h-full flex flex-col justify-end pb-10 max-w-4xl">
          <span className="text-xs font-semibold bg-white/10 border border-white/20 text-white px-2.5 py-1 rounded-full w-fit mb-4">
            {post.category}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold leading-tight text-white max-w-3xl">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl py-10">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 mb-10 pb-10 border-b border-zinc-900">
          <span className="font-medium text-zinc-400">{post.author.name}</span>
          <span>·</span>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </time>
          <span>·</span>
          <span>{post.readingTime}</span>
          <div className="flex flex-wrap gap-2 ml-auto">
            {post.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Description lead */}
        <p className="text-lg text-zinc-300 leading-relaxed mb-10 font-medium">
          {post.description}
        </p>

        {/* Article body */}
        <div
          className="prose prose-invert prose-zinc prose-sm md:prose-base max-w-none
            prose-headings:font-bold prose-headings:text-white
            prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
            prose-p:text-zinc-300 prose-p:leading-relaxed
            prose-li:text-zinc-300
            prose-strong:text-white
            prose-blockquote:border-l-zinc-700 prose-blockquote:text-zinc-400
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-table:border-collapse prose-table:w-full
            prose-th:text-left prose-th:text-zinc-400 prose-th:font-semibold prose-th:pb-2 prose-th:border-b prose-th:border-zinc-800
            prose-td:py-2 prose-td:pr-4 prose-td:text-zinc-300 prose-td:border-b prose-td:border-zinc-900
            prose-ol:list-decimal prose-ul:list-disc"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA block */}
        <div className="mt-16 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 text-center">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Try it yourself</p>
          <h3 className="text-2xl font-bold mb-3">Start creating with MotionForce</h3>
          <p className="text-zinc-400 text-sm mb-6">50 free credits every month. No credit card required.</p>
          <Link
            href="/signup"
            className="inline-flex items-center bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors"
          >
            Get started free
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-6">More Articles</h3>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group block p-5 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <span className="text-xs text-zinc-600 font-medium">{p.category}</span>
                  <h4 className="font-semibold text-sm mt-1.5 leading-snug group-hover:text-zinc-200 transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">{p.readingTime}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-zinc-900">
          <Link href="/blog" className="text-sm text-zinc-500 hover:text-white transition-colors">
            ← Back to Blog
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
