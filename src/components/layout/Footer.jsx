import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Rss, Newspaper } from 'lucide-react';
import { useCategories } from '@/hooks/useArticles';
import { DummyAd } from '../ads/DummyAd';

export function Footer() {
    const { data: categories } = useCategories();

    return (
        <footer className="bg-background border-t border-border/50 transition-colors duration-300">
            <div className="container mx-auto px-4 py-16">
                {/* Footer Ad Banner */}
                <div className="flex justify-center mb-16 pb-16 border-b border-border/50">
                    <DummyAd variant="leaderboard" label="Discover Global Insights" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-3 group">
                            <img
                                src="/logo1.webp"
                                alt="logo"
                                className="h-12 lg:h-16 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Your trusted hub for real-time headlines, community news, and deep investigative reporting focused on the stories that matter to you.
                        </p>
                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {[
                                { Icon: Facebook, href: "https://facebook.com", color: "hover:bg-blue-600" },
                                { Icon: Twitter, href: "https://twitter.com", color: "hover:bg-sky-500" },
                                { Icon: Instagram, href: "https://instagram.com", color: "hover:bg-pink-600" },
                                { Icon: Youtube, href: "https://youtube.com", color: "hover:bg-red-600" },
                                { Icon: Rss, href: "/rss", color: "hover:bg-orange-500" }
                            ].map(({ Icon, href, color }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-9 h-9 flex items-center justify-center rounded-xl bg-muted/50 text-muted-foreground ${color} hover:text-white transition-all duration-300`}
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">Trending News</h3>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {categories && categories.length > 0 ? (
                                categories.slice(0, 10).map((cat) => (
                                    <li key={cat._id}>
                                        <Link
                                            to={`/category/${cat.slug}`}
                                            className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                                        >
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                ['National', 'State', 'Local', 'Crime', 'Business', 'Sports'].map((name) => (
                                    <li key={name}>
                                        <span className="text-muted-foreground/50 text-sm font-medium">{name}</span>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">Information</h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Home', path: '/' },
                                { label: 'About Us', path: '/about' },
                                { label: 'Latest News', path: '/search' },
                                { label: 'Politics', path: '/category/politics' },
                                { label: 'Privacy Policy', path: '/privacy' },
                                { label: 'Terms of Service', path: '/terms' }
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.path}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">Stay Updated</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Subscribe to Daily News Views for the latest breaking news delivered to your inbox.
                        </p>
                        <form className="flex flex-col gap-3">
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 rounded-2xl bg-muted/50 border-none text-sm placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-red-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-red-600/20 hover:shadow-red-600/30 hover:bg-red-700 transition-all active:scale-[0.98]"
                            >
                                Get Breaking Alerts
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <p className="text-muted-foreground/60 text-xs font-medium">
                            © {new Date().getFullYear()} Daily News Views. All rights reserved.
                        </p>
                        <p className="text-muted-foreground/40 text-[10px] uppercase tracking-widest font-bold">
                            Powered by Advanced Intelligence
                        </p>
                    </div>
                    <div className="flex items-center gap-8">
                        <p className="text-muted-foreground/60 text-xs font-medium flex items-center gap-2">
                            <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                            System Status: Operational
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
