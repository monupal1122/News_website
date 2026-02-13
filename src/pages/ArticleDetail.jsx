import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Share2, Bookmark, ExternalLink } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useArticle, useRelatedArticles } from '@/hooks/useArticles';
import { CategoryBadge } from '@/components/news/CategoryBadge';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsCardSkeleton } from '@/components/news/NewsCardSkeleton';
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
                    <div className="max-w-4xl mx-auto">
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

            <article className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <div className="flex justify-center my-10">
                        <DummyAd variant="leaderboard" label="Discover World-Class Journalism" sublabel="Subscribe to our Premium Edition" />
                    </div>

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
                            <Link to={`/author/${typeof article.author === 'object' && article.author ? article.author._id : article.author || ''}`} className="flex items-center gap-3 group">
                                {typeof article.author === 'object' && article.author?.profileImage ? (
                                    <img src={article.author.profileImage} className="w-10 h-10 rounded-full object-cover" alt={article.author.name} />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <span className="text-primary font-semibold">
                                            {typeof article.author === 'object' && article.author ? article.author.name?.charAt(0) : (article.author)?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium group-hover:text-primary transition-colors">
                                        {typeof article.author === 'object' && article.author
                                            ? article.author.name
                                            : (typeof article.author === 'string' ? article.author : 'Unknown')}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{article.sourceName}</p>
                                </div>
                            </Link>
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

                    <div
                        className="prose prose-lg max-w-none mb-12"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    <div className="flex justify-center my-12 border-y border-zinc-100 py-10">
                        <DummyAd variant="rectangle" label="The Future of Finance" sublabel="Get the Chronicle Business Report" />
                    </div>

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
                </div>

                {relatedArticles && relatedArticles.length > 0 && (
                    <section className="max-w-6xl mx-auto mt-16">
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
            </article>
        </Layout>
    );
}
