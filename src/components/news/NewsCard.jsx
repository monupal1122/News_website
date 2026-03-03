import { Link } from "react-router-dom";
import { Clock, Eye, ArrowRight, Calendar } from "lucide-react";
import { formatDate } from "@/lib/types";
import { CategoryBadge } from "./CategoryBadge";

export function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  if (!content) return 0;
  const text = content.replace(/<[^>]*>/g, "");
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// ─── Truncated Summary ────────────────────────────────────────────────────────
function TruncatedSummary({ text, articleLink }) {
  if (!text) return null;
  const words = text.trim().split(/\s+/);
  const isLong = words.length > 18;
  const displayText = isLong ? words.slice(0, 18).join(" ") : text;

  return (
    <p className="text-zinc-500 text-sm leading-relaxed">
      {displayText}
      {isLong && (
        <>
          {"... "}
          <Link
            to={articleLink}
            className="inline text-red-600 font-semibold hover:underline whitespace-nowrap"
          >
            read more
          </Link>
        </>
      )}
    </p>
  );
}

// ─── Main NewsCard ────────────────────────────────────────────────────────────
export function NewsCard({ article, variant = "default" }) {
  const readingTime = calculateReadingTime(article.content);

  const categorySlug =
    typeof article.category === "object"
      ? article.category.slug
      : "uncategorized";

  const subcategorySlug =
    article.subcategories &&
    article.subcategories.length > 0 &&
    typeof article.subcategories[0] === "object"
      ? article.subcategories[0].slug
      : "general";

  const authorName =
    typeof article.author === "object"
      ? article.author.name
      : article.author || "Editorial Team";

  const imageSrc =
    article.featuredImage ||
    article.imageUrl ||
    "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?q=80&w=1000&auto=format&fit=crop";

  const excerpt = article.summary || article.description;
  const totalview = article.viewCount;

  const articleLink =
    article.slug && article.publicId
      ? `/${categorySlug}/${subcategorySlug}/${article.slug}-${article.publicId}`
      : `/articles/${article._id}`;

  const categoryName =
    typeof article.category === "object"
      ? article.category.name
      : categorySlug;

  // ─── Featured Variant ───────────────────────────────────────────────────────
  if (variant === "featured") {
    return (
      <Link
        to={articleLink}
        className="group block h-full bg-white hover:shadow-xl transition-all duration-300 border border-zinc-100 rounded-2xl overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row h-full">

          {/* Image */}
          <div className="
            w-full aspect-[16/9]
            lg:w-[58%] lg:aspect-auto lg:min-h-[320px]
            relative overflow-hidden
            rounded-xl m-2
            lg:rounded-xl lg:m-3
            flex-shrink-0
          ">
            <img
              src={imageSrc}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Category pill on image — mobile only */}
            <div className="absolute top-3 left-3 lg:hidden">
              <CategoryBadge category={article.category} />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-4 sm:p-5 lg:p-6 flex-1 min-w-0">

            {/* Category + date — desktop only */}
            <div className="hidden lg:flex items-center gap-3 mb-3">
              <CategoryBadge category={article.category} />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
            </div>

            {/* Title */}
            <h2 className="
              font-serif font-bold text-zinc-900 leading-snug
              group-hover:text-red-700 transition-colors
              line-clamp-3
              text-xl sm:text-2xl lg:text-3xl xl:text-4xl
              mb-2 lg:mb-4
            ">
              {article.title}
            </h2>

            {/* Excerpt */}
            <p className="
              text-zinc-500 leading-relaxed
              line-clamp-2 lg:line-clamp-4
              text-sm sm:text-base lg:text-[15px]
              mb-3 lg:mb-5
            ">
              {excerpt}
            </p>

            {/* Published date — desktop */}
            <p className="hidden lg:block text-zinc-400 text-sm mb-5 font-medium">
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
                hour: "numeric", minute: "numeric", hour12: true,
              })}
            </p>

            {/* Meta row — mobile */}
            <div className="flex lg:hidden items-center gap-3 text-xs text-zinc-400 font-medium mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {totalview} views
              </span>
            </div>

            {/* CTA */}
            <div className="mt-auto flex items-center gap-2 text-sm font-bold text-zinc-900 uppercase tracking-widest group-hover:gap-3 transition-all">
              Read Full Story
              <ArrowRight className="w-4 h-4 text-red-600 flex-shrink-0" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ─── Horizontal Variant ─────────────────────────────────────────────────────
  if (variant === "horizontal") {
    return (
      <Link
        to={articleLink}
        className="group flex gap-3 p-3 hover:bg-zinc-50 hover:shadow-sm transition-all duration-300 bg-white rounded-2xl border border-zinc-100"
      >
        {/* Thumbnail */}
        <div className="
          flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 shadow-sm
          w-24 h-20
          sm:w-32 sm:h-24
          md:w-36 md:h-26
        ">
          <img
            src={imageSrc}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center min-w-0 flex-1 gap-1">
          {/* Category */}
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-3 bg-red-600 rounded-full flex-shrink-0" />
            <span className="text-[11px] sm:text-xs font-black uppercase text-zinc-400 tracking-widest truncate">
              {categoryName}
            </span>
          </div>

          {/* Title */}
          <h4 className="
            font-black text-zinc-900 leading-snug
            group-hover:text-red-600 transition-colors tracking-tight
            line-clamp-2
            text-sm sm:text-base md:text-[15px]
          ">
            {article.title}
          </h4>

          {/* Meta */}
          <div className="flex items-center gap-3 text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wide mt-0.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              {formatDate(article.publishedAt || article.createdAt)}
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 flex-shrink-0" />
              {totalview}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // ─── Default Variant ────────────────────────────────────────────────────────
  return (
    <div className="group relative bg-white overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 border border-zinc-100 rounded-2xl">

      {/* Image */}
      <Link
        to={articleLink}
        className="relative overflow-hidden block rounded-xl m-2 mb-0"
        style={{ aspectRatio: "16/9" }}
      >
        <img
          src={imageSrc}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-xl"
        />
        {/* Category badge on image */}
        {/* <div className="absolute top-2 left-2">
          <CategoryBadge category={article.category} size="sm" />
        </div> */}
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-3 pt-2 gap-2">

        {/* Title */}
        <Link to={articleLink} className="block">
          <h3 className="
            font-bold leading-snug text-zinc-800
            group-hover:text-red-700 transition-colors
            line-clamp-2
            text-base sm:text-lg
          ">
            {article.title}
          </h3>
        </Link>

        {/* Excerpt — hide on very small screens to save space */}
        <div className="hidden xs:block sm:block">
          <TruncatedSummary text={excerpt} articleLink={articleLink} />
        </div>

        {/* Meta row */}
        <div className="mt-auto flex items-center flex-wrap gap-x-3 gap-y-1 text-zinc-400 font-medium pt-2 border-t border-zinc-100">
          <span className="flex items-center gap-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            {formatDate(article.publishedAt || article.createdAt)}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Eye className="w-3.5 h-3.5 flex-shrink-0" />
            {totalview} views
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            {readingTime} min
          </span>
        </div>
      </div>
    </div>
  );
}