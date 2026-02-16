import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Share2, Bookmark, ExternalLink, Twitter, Linkedin, Facebook, Instagram, Mail } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useArticle, useRelatedArticles } from '@/hooks/useArticles';
import { CategoryBadge } from '@/components/news/CategoryBadge';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsCardSkeleton } from '@/components/news/NewsCardSkeleton';
import { TrendingSidebar } from '@/components/news/TrendingSidebar';
import { formatDate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { DummyAd } from '@/components/ads/DummyAd';

export default function ArticleDetail() {
    const { category, subcategory, slugId } = useParams();
    const { data: article, isLoading } = useArticle(`${category}/${subcategory}/${slugId}` || '');
    const { data: relatedArticles, isLoading: relatedLoading } = useRelatedArticles(article);

    if (isLoading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8">
                            <div className="h-8 w-48 skeleton-shimmer rounded mb-6" />
                            <div className="h-12 w-full skeleton-shimmer rounded mb-4" />
                            <div className="h-6 w-2/3 skeleton-shimmer rounded mb-8" />
                            <div className="aspect-video skeleton-shimmer rounded-xl mb-8" />
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="h-4 w-full skeleton-shimmer rounded" />
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-4 hidden lg:block">
                            <div className="h-96 w-full skeleton-shimmer rounded-xl" />
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!article) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-3xl font-bold mb-4">Article not found</h1>
                    <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
                    <Link to="/">
                        <Button>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    const author = typeof article.author === 'object' ? article.author : null;

    return (
        <Layout>
            <Helmet>
                <title>{article.title}</title>
                <meta name="description" content={article.description} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.description} />
                <meta property="og:image" content={article.imageUrl} />
                <meta property="og:type" content="article" />
                <link
                    rel="canonical"
                    href={`https://korsimnaturals.com/${article.category?.slug || ''}/${article.subcategories?.[0]?.slug || 'general'}/${article.slug}-${article.publicId}`}
                />
            </Helmet>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <main className="lg:col-span-8">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>

                        <div className="flex justify-center mb-8">
                            <DummyAd variant="leaderboard" label="Discover World-Class Journalism" sublabel="Subscribe to our Premium Edition" />
                        </div>

                        <article>
                            <div className="flex items-center gap-4 mb-4">
                                <CategoryBadge category={article.category} size="md" />
                                <span className="flex items-center gap-1 text-muted-foreground text-sm">
                                    <Clock className="w-4 h-4" />
                                    {formatDate(article.publishedAt || article.createdAt)}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground text-sm">
                                    <Eye className="w-4 h-4" />
                                    {article.viewCount.toLocaleString()} views
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                                {article.title}
                            </h1>

                            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                                {article.summary || article.description}
                            </p>

                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                                <div className="flex items-center gap-3">
                                    {/* Author info removed from here */}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon">
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Bookmark className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="relative aspect-video rounded-xl overflow-hidden mb-8 shadow-2xl shadow-primary/5">
                                <img
                                    src={article.featuredImage || article.imageUrl}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="mb-10">
                                {article.imageCaption && (
                                    <p className="text-sm text-zinc-500 italic mb-4">{article.imageCaption}</p>
                                )}

                                <p className="text-zinc-500 text-sm mb-6 font-medium">
                                    Published on: {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-6 border-y border-zinc-100">
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-zinc-200 text-zinc-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
                                            <Facebook className="w-5 h-5" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-zinc-200 text-zinc-600 hover:bg-black hover:text-white hover:border-black transition-all">
                                            <Twitter className="w-5 h-5" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-zinc-200 text-zinc-600 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.248-.57-.397m-5.475 7.625c-3.153 0-5.986-1.953-6.995-4.839l-1.05 3.149 3.298-1.05c1.439.815 3.033 1.239 4.747 1.239 5.241 0 9.5-4.259 9.5-9.5s-4.259-9.5-9.5-9.5-9.5 4.259-9.5 9.5c0 1.713.424 3.308 1.239 4.747l-1.05 3.298 3.149-1.05c2.887 1.009 5.843 1.009 8.653 0 .81-.291 1.554-.707 2.207-1.239 1.408-1.144 2.39-2.887 2.39-4.839 0-3.518-2.859-6.376-6.376-6.376s-6.376 2.859-6.376 6.376c0 1.952.982 3.695 2.39 4.839.653.532 1.397.948 2.207 1.239z" />
                                            </svg>
                                        </Button>
                                        <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-zinc-200 text-zinc-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all">
                                            <Linkedin className="w-5 h-5" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-foreground hover:border-zinc-300 transition-all">
                                            <Mail className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-zinc-900">Join our community</span>
                                        <a href="#" className="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors shadow-sm hover:shadow-md">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.248-.57-.397m-5.475 7.625c-3.153 0-5.986-1.953-6.995-4.839l-1.05 3.149 3.298-1.05c1.439.815 3.033 1.239 4.747 1.239 5.241 0 9.5-4.259 9.5-9.5s-4.259-9.5-9.5-9.5-9.5 4.259-9.5 9.5c0 1.713.424 3.308 1.239 4.747l-1.05 3.298 3.149-1.05c2.887 1.009 5.843 1.009 8.653 0 .81-.291 1.554-.707 2.207-1.239 1.408-1.144 2.39-2.887 2.39-4.839 0-3.518-2.859-6.376-6.376-6.376s-6.376 2.859-6.376 6.376c0 1.952.982 3.695 2.39 4.839.653.532 1.397.948 2.207 1.239z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="prose prose-lg max-w-none mb-12"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />

                            {/* <div className="flex justify-center my-12 border-y border-zinc-100 py-10">
                                <DummyAd variant="rectangle" label="The Future of Finance" sublabel="Get the Chronicle Business Report" />
                            </div> */}

                            {article.tags && article.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-8 mb-12">
                                    {article.tags.map(tag => (
                                        <Link
                                            key={tag}
                                            to={`/tags/${tag}`}
                                            className="px-3 py-1 bg-muted hover:bg-primary hover:text-white rounded-full text-sm transition-colors"
                                        >
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {article.sourceUrl && (
                                <div className="mt-12 p-6 bg-muted/30 rounded-2xl border border-border/50">
                                    <p className="text-sm text-muted-foreground mb-3 font-semibold uppercase tracking-wider">Originally published on:</p>
                                    <a
                                        href={article.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-bold text-lg transition-colors group"
                                    >
                                        {article.sourceName}
                                        <ExternalLink className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </a>
                                </div>
                            )}

                            {author && (
                                <div className="mt-12 p-6 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-4">
                                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Published by:</span>
                                    <Link to={`/author/${author._id}`} className="flex items-center gap-3 group">
                                        <img
                                            src={author.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=random`}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-primary/20 transition-colors"
                                            alt={author.name}
                                        />
                                        <span className="font-bold text-lg text-zinc-900 group-hover:text-primary transition-colors">
                                            {author.name}
                                        </span>
                                    </Link>
                                </div>
                            )}

                        </article>
                    </main>

                    <aside className="lg:col-span-4">
                        <div className="sticky top-34 space-y-8">
                            <TrendingSidebar />
                            <DummyAd variant="rectangle" label="Sponsored Content" sublabel="Ad space available" />
                        </div>
                    </aside>
                </div>

                {relatedArticles && relatedArticles.length > 0 && (
                    <section className="mt-16 pt-16 border-t border-zinc-200">
                        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedLoading
                                ? Array.from({ length: 4 }).map((_, i) => (
                                    <NewsCardSkeleton key={i} />
                                ))
                                : relatedArticles.map((related) => (
                                    <NewsCard key={related._id} article={related} />
                                ))}
                        </div>
                    </section>
                )}
            </div>
        </Layout>
    );
}
