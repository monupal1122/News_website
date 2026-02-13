import React from 'react';
import { Layout } from '../components/layout/Layout';
import { HeroSection } from '../components/news/HeroSection';
import { CategorySection } from '../components/news/CategorySection';
import { TrendingSidebar } from '../components/news/TrendingSidebar';
import { DummyAd } from '../components/ads/DummyAd';

const Index = () => {
    return (
        <Layout>
            {/* Hero Section - High Impact */}
            <div className="bg-zinc-50 border-b border-zinc-200">
                <HeroSection />
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-8 space-y-24">
                        <CategorySection category="national" title="National Headlines" />

                        {/* Middle Ad Break */}
                        <div className="py-12 flex justify-center">
                            <DummyAd variant="leaderboard" label="Discover Premium Lifestyle" sublabel="Exclusively for Chronicle Readers" />
                        </div>

                        <CategorySection category="punjab" title="Punjab Spotlight" />

                        <CategorySection category="sports" title="Sports" />

                        <div className="py-12 flex justify-center">
                            <DummyAd variant="leaderboard" label="Global Business Summit 2026" sublabel="Register for Early Access" />
                        </div>

                        <CategorySection category="technology" title="Tech" />
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="lg:col-span-4 space-y-12">
                        <TrendingSidebar />

                        <div className="sticky top-40 space-y-12">
                            <DummyAd variant="rectangle" label="Boost Your Portfolio" sublabel="Financial Intelligence for the 1%" />

                            <div className="bg-red-600 p-8 text-white shadow-2xl">
                                <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Stay Connected</h3>
                                <p className="text-white/80 text-sm mb-6 font-medium leading-relaxed italic">
                                    Join 50,000+ readers who receive our daily digest of the most important stories.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="bg-white/10 border border-white/20 p-3 text-sm focus:bg-white/20 focus:outline-none placeholder:text-white/50"
                                    />
                                    <button className="bg-zinc-900 text-white p-3 text-sm font-black uppercase tracking-widest hover:bg-white hover:text-red-600 transition-all shadow-lg">
                                        Subscribe Now
                                    </button>
                                </div>
                            </div>

                            <div className="bg-zinc-900 p-8 text-white">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-red-600">Newsletter</h3>
                                <p className="text-zinc-500 text-sm font-medium">Daily Intelligence. Straight to your inbox.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-24 pt-24 border-t-8 border-red-600 space-y-24">
                    <CategorySection category="entertainment" title="Culture & Entertainment" />

                    <div className="flex justify-center">
                        <DummyAd variant="leaderboard" label="Experience Luxury Travel" sublabel="Curated Destinations Await" />
                    </div>

                    <CategorySection category="business" title="Global Business" />
                </div>
            </div>
        </Layout>
    );
};

export default Index;
