import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/news/HeroSection';
import { CategorySection } from '@/components/news/CategorySection';
import { TrendingSidebar } from '@/components/news/TrendingSidebar';
import { AdSlot } from '@/components/ads/AdSlot';

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
            <CategorySection category="national" title="National News" />
            <CategorySection category="punjab" title="Punjab Special" />
            <AdSlot slot="middle-content-banner" format="horizontal" />
            <CategorySection category="sports" title="Sports Arena" />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <AdSlot slot="home-sidebar-top" format="rectangle" />
            <TrendingSidebar />
            <AdSlot slot="home-sidebar-bottom" format="rectangle" />
          </div>
        </div>

        {/* More Categories */}
        <div className="mt-16 space-y-12">
          <CategorySection category="entertainment" title="Entertainment & Lifestyle" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CategorySection category="technology" title="Tech Trends" />
            <CategorySection category="business" title="Business & Markets" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
