import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useArticlesByCategory } from '@/hooks/useArticles';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsCardSkeleton } from '@/components/news/NewsCardSkeleton';

export function CategorySection({ category, title }) {
    const { data: articles, isLoading } = useArticlesByCategory(category, 6);

    return (
        <section className="animate-fade-in">
            <div className="flex items-end justify-between mb-10 pb-4 border-b-4 border-zinc-900 relative">
                <div className="flex flex-col gap-2">

                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900 leading-none">{title}</h2>
                </div>
                <Link
                    to={`/category/${category}`}
                    className="flex items-center gap-2 text-white bg-red-600 hover:bg-zinc-900 transition-all text-[11px] font-black uppercase tracking-widest px-6 py-3 shadow-xl"
                >
                    View Section <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="absolute bottom-[-4px] left-0 w-48 h-1 bg-red-600" />
            </div>

            {articles && articles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {isLoading
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <NewsCardSkeleton key={i} />
                        ))
                        : articles.slice(0, 3).map((article) => (
                            <div key={article._id} className="h-full animate-fade-in">
                                <NewsCard article={article} />
                            </div>
                        ))
                    }
                </div>
            ) : !isLoading && (
                <div className="py-20 text-center border-2 border-dashed border-zinc-200 bg-zinc-50">
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">No stories published in {title} yet.</p>
                </div>
            )}
        </section>
    );
}
