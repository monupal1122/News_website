import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Rss, Newspaper } from 'lucide-react';
import { useCategories } from '@/hooks/useArticles';

export function Footer() {
    const { data: categories } = useCategories();

    return (
        <footer className="bg-background border-t border-border/50 transition-colors duration-300">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                                <Newspaper className="text-primary-foreground w-6 h-6" />
                            </div>
                            <span className="text-xl font-black tracking-tighter font-serif">CHRONICLE</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Your trusted hub for real-time intelligence, deep investigative reporting, and global perspectives on technology, business, and culture.
                        </p>
                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {[
                                { Icon: Facebook, href: "#" },
                                { Icon: Twitter, href: "#" },
                                { Icon: Instagram, href: "#" },
                                { Icon: Youtube, href: "#" },
                                { Icon: Rss, href: "#" }
                            ].map(({ Icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">Explore</h3>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {categories && categories.length > 0 ? (
                                categories.map((cat) => (
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
                                ['Business', 'Tech', 'Sports', 'Health', 'Science', 'Style'].map((name) => (
                                    <li key={name}>
                                        <span className="text-muted-foreground/50 text-sm font-medium">{name}</span>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">Company</h3>
                        <ul className="space-y-3">
                            {['Home', 'About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map((link) => (
                                <li key={link}>
                                    <Link
                                        to={link === 'Home' ? '/' : '#'}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                                    >
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">Intelligence Brief</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Join 50,000+ subscribers for a curated morning briefing.
                        </p>
                        <form className="flex flex-col gap-3">
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="name@email.com"
                                    className="w-full px-4 py-3 rounded-2xl bg-muted/50 border-none text-sm placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:opacity-95 transition-all active:scale-[0.98]"
                            >
                                Sign Up Now
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <p className="text-muted-foreground/60 text-xs font-medium">
                            © {new Date().getFullYear()} Chronicle Media Group. All rights reserved.
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
