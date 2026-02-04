import { useFeaturedArticles } from '@/hooks/useArticles';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsCardSkeleton } from '@/components/news/NewsCardSkeleton';

export function HeroSection() {
  const { data: featured, isLoading } = useFeaturedArticles(4);

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NewsCardSkeleton variant="featured" />
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <NewsCardSkeleton key={i} variant="horizontal" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!featured?.length) return null;

  const [mainArticle, ...sideArticles] = featured;

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main featured article */}
        <div className="animate-fade-in-up">
          <NewsCard article={mainArticle} variant="featured" />
        </div>

        {/* Side articles */}
        <div className="flex flex-col gap-2">
          {sideArticles.map((article, index) => (
            <div
              key={article._id}
              className={`animate-fade-in-up-delay-${index + 1}`}
            >
              <NewsCard article={article} variant="horizontal" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
