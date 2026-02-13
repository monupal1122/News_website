import { TrendingUp } from 'lucide-react';
import { useTrendingArticles } from '@/hooks/useArticles';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsCardSkeleton } from '@/components/news/NewsCardSkeleton';

export function TrendingSidebar() {
    const { data: trending, isLoading } = useTrendingArticles(6);

    return (
        <aside className="bg-white border border-zinc-100 shadow-sm overflow-hidden">
            <div className="bg-zinc-900 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-red-600" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-white">Trending Now</h2>
                </div>
                <TrendingUp className="w-4 h-4 text-red-500 animate-pulse" />
            </div>
            <div className="flex flex-col">
                {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <NewsCardSkeleton key={i} variant="horizontal" />
                    ))
                    : trending?.map((article) => (
                        <NewsCard key={article._id} article={article} variant="horizontal" />
                    ))}
            </div>
        </aside>
    );
}
