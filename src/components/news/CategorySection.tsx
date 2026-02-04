import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useArticlesByCategory } from '@/hooks/useArticles';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsCardSkeleton } from '@/components/news/NewsCardSkeleton';
import type { Category } from '@/lib/types';

interface CategorySectionProps {
  category: string;
  title: string;
}

export function CategorySection({ category, title }: CategorySectionProps) {
  const { data: articles, isLoading } = useArticlesByCategory(category, 4);

  return (
    <section className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link
          to={`/category/${category}`}
          className="flex items-center gap-1 text-primary hover:gap-2 transition-all text-sm font-medium"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))
          : articles?.map((article) => (
            <NewsCard key={article._id} article={article} />
          ))}
      </div>
    </section>
  );
}
