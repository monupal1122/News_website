import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import type { Article } from '@/lib/types';
import { formatDate } from '@/lib/types';
import { CategoryBadge } from './CategoryBadge';

interface NewsCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact' | 'horizontal';
}

export function NewsCard({ article, variant = 'default' }: NewsCardProps) {
  if (variant === 'featured') {
    return (
      <Link to={`/${(article.category as any)?.slug}/${(article.subcategory as any)?.slug}/${article.slug}-${article._id}`} className="group block news-card-featured">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <CategoryBadge category={article.category} linked={false} size="md" />
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-white leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h2>
            <p className="mt-2 text-white/80 line-clamp-2 text-sm md:text-base">
              {article.description}
            </p>
            <div className="mt-3 flex items-center gap-4 text-white/70 text-sm">
              <span className="font-medium">{article.author}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(article.publishedAt)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link to={`/${(article.category as any)?.slug}/${(article.subcategory as any)?.slug}/${article.slug}-${article._id}`} className="group block">
        <div className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex-1 min-w-0">
            <CategoryBadge category={article.category} linked={false} size="sm" />
            <h3 className="mt-1.5 font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors font-sans">
              {article.title}
            </h3>
            <div className="mt-2 flex items-center gap-2 text-muted-foreground text-xs">
              <Clock className="w-3 h-3" />
              {formatDate(article.publishedAt)}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/${(article.category as any)?.slug}/${(article.subcategory as any)?.slug}/${article.slug}-${article._id}`} className="group block py-4 border-b border-border last:border-0">
        <div className="flex items-start gap-3">
          <span className="text-3xl font-bold text-muted-foreground/30 font-serif leading-none">
            {String(article.viewCount).slice(-2).padStart(2, '0')}
          </span>
          <div>
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors font-sans">
              {article.title}
            </h3>
            <div className="mt-1.5 flex items-center gap-2 text-muted-foreground text-xs">
              <CategoryBadge category={article.category} linked={false} size="sm" />
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {article.viewCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link to={`/${(article.category as any)?.slug}/${(article.subcategory as any)?.slug}/${article.slug}-${article._id}`} className="group block news-card">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <CategoryBadge category={article.category} linked={false} />
        <h3 className="mt-2 font-bold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <p className="mt-2 text-muted-foreground text-sm line-clamp-2">
          {article.description}
        </p>
        <div className="mt-3 flex items-center justify-between text-muted-foreground text-xs">
          <span className="font-medium">{article.author}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(article.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
