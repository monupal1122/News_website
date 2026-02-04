import { TrendingUp } from 'lucide-react';
import { useTrendingArticles } from '@/hooks/useArticles';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsCardSkeleton } from '@/components/news/NewsCardSkeleton';

export function TrendingSidebar() {
  const { data: trending, isLoading } = useTrendingArticles(5);

  return (
    <aside className="bg-card rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Trending</h2>
      </div>
      <div className="divide-y divide-border">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
            <NewsCardSkeleton key={i} variant="compact" />
          ))
          : trending?.map((article) => (
            <NewsCard key={article._id} article={article} variant="compact" />
          ))}
      </div>
    </aside>
  );
}
