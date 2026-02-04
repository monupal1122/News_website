import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/news/HeroSection';
import { CategorySection } from '@/components/news/CategorySection';
import { TrendingSidebar } from '@/components/news/TrendingSidebar';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles Grid */}
          <div className="lg:col-span-2 space-y-12">
            <CategorySection category="technology" title="Technology" />
            <CategorySection category="business" title="Business" />
            <CategorySection category="sports" title="Sports" />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <TrendingSidebar />
          </div>
        </div>

        {/* More Categories */}
        <div className="mt-16 space-y-12">
          <CategorySection category="entertainment" title="Entertainment" />
          <CategorySection category="health" title="Health" />
          <CategorySection category="science" title="Science" />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
