import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Eye,
  ExternalLink,
  Mail,
  Newspaper,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { useArticle, useRelatedArticles } from "@/hooks/useArticles";
import { CategoryBadge } from "@/components/news/CategoryBadge";
import { NewsCard } from "@/components/news/NewsCard";
import { NewsCardSkeleton } from "@/components/news/NewsCardSkeleton";
import { TrendingSidebar } from "@/components/news/TrendingSidebar";
import { formatDate } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { DummyAd } from "@/components/ads/DummyAd";

// ✅ FIX 1: Set your actual production domains
const SITE_DOMAIN = "https://korsimnaturals.com";
const IMAGE_BASE_URL = "https://admin.korsimnaturals.com";
const DEFAULT_OG_IMAGE = `${SITE_DOMAIN}/logo1.webp`; // Ensure this exists in your public folder
const TWITTER_HANDLE = "@DailyNewsViews";

/**
 * ✅ FIX 2: Ensures image URL is always absolute and points to the admin backend.
 */
function toAbsoluteUrl(url) {
  if (!url) return DEFAULT_OG_IMAGE;
  if (url.startsWith("http://") || url.startsWith("https://") || url.toLowerCase().includes("cloudinary.com")) return url;

  // Clean path by removing 'public/' or 'public\' prefix and ensuring forward slashes
  const cleanPath = url.replace(/^public[\\/]/, "").replace(/\\/g, "/");
  const finalPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

  return `${IMAGE_BASE_URL}${finalPath}`;
}

/**
 * ✅ FIX 3: Build the canonical page URL on both server and client safely.
 * window is undefined during SSR/prerendering — always fall back gracefully.
 */
function getCurrentUrl(seoPath) {
  if (typeof window !== "undefined") {
    return window.location.href;
  }
  return `${SITE_DOMAIN}/${seoPath}`;
}

export default function ArticleDetail() {
  const { category, subcategory, slugId } = useParams();

  const seoPath = `${encodeURIComponent(category || "")}/${encodeURIComponent(subcategory || "")}/${encodeURIComponent(slugId || "")}`;
  const { data: article, isLoading, error } = useArticle(seoPath);
  const { data: relatedArticles, isLoading: relatedLoading } =
    useRelatedArticles(article);

  if (error) {
    console.error("Article Fetch Error:", error);
  }

  // ─── Loading State ────────────────────────────────────────────────────────
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
                  <div
                    key={i}
                    className="h-4 w-full skeleton-shimmer rounded"
                  />
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

  // ─── Not Found State ──────────────────────────────────────────────────────
  if (!article) {
    return (
      <Layout>
        <Helmet>
          <title>Article Not Found | Daily News Views</title>
          <meta
            name="description"
            content="The news story you are looking for could not be found."
          />
        </Helmet>
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Newspaper className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">
              Story Not Found
            </h1>
            <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
              The article you're looking for doesn't exist or may have been
              moved. Explore our latest headlines or try searching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="w-full sm:w-auto px-8 py-6 rounded-xl font-bold uppercase tracking-widest text-xs">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/search">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-6 rounded-xl font-bold uppercase tracking-widest text-xs"
                >
                  Browse News
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ─── Derived values ───────────────────────────────────────────────────────
  const author = typeof article.author === "object" ? article.author : null;

  // ✅ FIX 4: All URLs are absolute and safe for crawlers
  const pageUrl = getCurrentUrl(seoPath);
  const ogImage = toAbsoluteUrl(article.featuredImage || article.imageUrl);
  const ogDescription = article.summary || article.description || "";
  const ogTitle = article.title || "Daily News Views";

  // ─── Share Handler ────────────────────────────────────────────────────────
  const handleShare = async (platform) => {
    if (!article) {
      toast.error("Nothing to share at the moment.");
      return;
    }

    const title = article.title || "Check out this news article";

    // ✅ FIX 5: Use decoded URL so Hindi/non-ASCII characters show as text
    const readableUrl = decodeURIComponent(pageUrl);
    const shareText = `${title}\n\nRead more at: ${readableUrl}`;

    const platforms = {
      // ✅ FIX 6: WhatsApp share now includes the article image via OG tags
      // WhatsApp reads OG tags automatically when the link is pasted,
      // so we just need to share the clean URL.
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(pageUrl)}&via=${TWITTER_HANDLE.replace("@", "")}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText)}`,
    };

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(readableUrl);
        toast.success("Link copied to clipboard!");
      } catch {
        toast.error("Failed to copy link");
      }
      return;
    }

    if (platforms[platform]) {
      window.open(platforms[platform], "_blank", "noopener,noreferrer");
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Layout>

      <Helmet>
        <title>{ogTitle} | Daily News Views</title>
        <meta name="description" content={ogDescription} />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph — controls image/title shown when link is shared */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Daily News Views" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={pageUrl} />

        {/* ✅ Both og:image and og:image:secure_url must be absolute HTTPS URLs */}
        <meta property="og:image" content={article.featuredImage} />
        <meta property="og:image:secure_url" content={article.featuredImagee} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={ogTitle} />

        {/* Article-specific OG tags */}
        <meta
          property="article:published_time"
          content={article.publishedAt || article.createdAt}
        />
        <meta property="article:modified_time" content={article.updatedAt} />
        <meta property="article:author" content={author?.name || ""} />
        <meta
          property="article:section"
          content={article.category?.name || ""}
        />
        {article.tags?.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Twitter Card — controls Twitter share preview */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="twitter:creator" content={TWITTER_HANDLE} />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={ogTitle} />
        <meta name="twitter:url" content={pageUrl} />
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

            <article>
              {/* Meta row */}
              <div className="flex items-center gap-4 mb-4">
                {article?.category && (
                  <CategoryBadge category={article.category} size="md" />
                )}
                <span className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  {formatDate(article?.publishedAt || article?.createdAt)}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Eye className="w-4 h-4" />
                  {article?.viewCount?.toLocaleString() || 0} views
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                {article?.title || "Loading..."}
              </h1>

              {/* Summary */}
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {article.summary || article.description}
              </p>

              {/* ✅ FIX 8: Featured image with fallback — won't break if URL is missing */}
              {ogImage && (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-8 shadow-2xl shadow-primary/5 bg-zinc-100">
                  <img
                    src={ogImage}
                    alt={article?.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Gracefully hide broken images instead of showing broken icon
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Caption + publish date + share bar */}
              <div className="mb-10">
                {article?.imageCaption && (
                  <p className="text-sm text-zinc-500 italic mb-4">
                    {article.imageCaption}
                  </p>
                )}

                {article && (article.publishedAt || article.createdAt) && (
                  <p className="text-zinc-500 text-sm mb-6 font-medium">
                    Published on:{" "}
                    {new Date(
                      article.publishedAt || article.createdAt,
                    ).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </p>
                )}

                {/* Share bar */}
                <div className="flex flex-row items-center justify-between py-4 border-y border-zinc-100">
                  <div className="flex items-center gap-1 md:gap-2">
                    {/* Facebook */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-8 h-8 md:w-10 md:h-10 border-zinc-200 text-zinc-600 cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                      onClick={() => handleShare("facebook")}
                      title="Share on Facebook"
                    >
                      <img
                        src="/facebook.webp"
                        className="w-7 h-7 md:w-9 md:h-9"
                        alt="Facebook"
                      />
                    </Button>

                    {/* Twitter / X */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-8 h-8 md:w-10 md:h-10 border-zinc-200 text-zinc-600 cursor-pointer hover:text-white hover:border-gray-200 transition-all hover:bg-gray-300"
                      onClick={() => handleShare("twitter")}
                      title="Share on X (Twitter)"
                    >
                      <img
                        src="/twitter-x.webp"
                        className="w-5 h-5 md:w-6 md:h-6"
                        alt="Twitter"
                      />
                    </Button>

                    {/* LinkedIn */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-8 h-8 md:w-10 md:h-10 cursor-pointer border-zinc-200 text-zinc-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all"
                      onClick={() => handleShare("linkedin")}
                      title="Share on LinkedIn"
                    >
                      <img
                        src="/linkedin.webp"
                        className="w-8 h-8 md:w-10 md:h-10"
                        alt="LinkedIn"
                      />
                    </Button>

                    {/* Email */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-8 h-8 md:w-10 md:h-10 border-zinc-200 cursor-pointer text-zinc-600 hover:bg-zinc-100 hover:text-foreground hover:border-zinc-300 transition-all"
                      onClick={() => handleShare("email")}
                      title="Share via Email"
                    >
                      <Mail className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>

                    {/* ✅ FIX 9: Copy link button — now uses Copy icon from lucide (no missing image) */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-8 h-8 md:w-10 md:h-10 border-zinc-200 cursor-pointer text-zinc-600 hover:bg-zinc-100 hover:text-foreground hover:border-zinc-300 transition-all"
                      onClick={() => handleShare("copy")}
                      title="Copy link"
                    >
                      <Copy className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                  </div>

                  {/* WhatsApp community join */}
                  <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
                    <span className="font-bold text-zinc-900 text-xs md:text-sm whitespace-nowrap">
                      Join our community
                    </span>
                    {/* ✅ FIX 10: Replace placeholder channel URL with your real one */}
                    <a
                      href="https://whatsapp.com/channel/YOUR_REAL_CHANNEL_ID"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-green-600 text-white cursor-pointer rounded-full transition-colors shadow-sm hover:shadow-md flex-shrink-0"
                      title="Join our WhatsApp Channel"
                    >
                      <img
                        src="/whatsapp1.png"
                        alt="WhatsApp"
                        className="w-8 h-8 md:w-10 md:h-10"
                      />
                    </a>
                  </div>
                </div>
              </div>

              {/* Article body */}
              <div
                className="prose prose-lg max-w-none mb-12 text-xl"
                dangerouslySetInnerHTML={{ __html: article?.content || "" }}
              />

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 mb-12">
                  {article.tags.map((tag) => (
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

              {/* Source link */}
              {article.sourceUrl && (
                <div className="mt-12 p-6 bg-muted/30 rounded-2xl border border-border/50">
                  <p className="text-sm text-muted-foreground mb-3 font-semibold uppercase tracking-wider">
                    Originally published on:
                  </p>
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

              {/* Author */}
              {author && (
                <div className="mt-12 p-6 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-4">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Published by:
                  </span>
                  <Link
                    to={`/author/${author._id}`}
                    className="flex items-center gap-3 group"
                  >
                    <span className="font-bold text-lg text-zinc-900 group-hover:text-primary transition-colors">
                      {author.name}
                    </span>
                  </Link>
                </div>
              )}
            </article>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-34 space-y-8">
              <TrendingSidebar />
              <DummyAd
                variant="rectangle"
                label="Sponsored Content"
                sublabel="Ad space available"
              />
            </div>
          </aside>
        </div>

        {/* Related articles */}
        {relatedArticles && relatedArticles.length > 0 && (
          <section className="mt-16 pt-16 border-t border-zinc-200">
            <div className="flex items-end justify-between mb-10 pb-4 border-b-4 border-zinc-900 relative">
              <div className="flex flex-col gap-2">
                {/* ✅ FIX 11: Fixed typo "Releated" → "Related" */}
                <h2 className="text-2xl md:text-2xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
                  Related Articles
                </h2>
              </div>
              <div className="absolute bottom-[-4px] left-0 w-48 h-1 bg-red-600" />
            </div>
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
