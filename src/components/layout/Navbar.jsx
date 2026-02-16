import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, Rocket, Newspaper, Facebook, Twitter, Instagram, Globe, ArrowRight, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useArticleContext } from '@/context/ArticleContext';
import ads from '@/ads.json';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isTickerPaused, setIsTickerPaused] = useState(false);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const navigate = useNavigate();

    const { categories, isCategoriesLoading, topHeadlines: latestArticles } = useArticleContext();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const adInterval = setInterval(() => {
            setCurrentAdIndex((prev) => (prev + 1) % ads.length);
        }, 5000);
        return () => clearInterval(adInterval);
    }, []);

    const formattedDate = currentTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsSearchOpen(false);
        }
    };

    const getArticleLink = (article) => {
        const categorySlug = typeof article.category === 'object' ? article.category.slug : 'uncategorized';
        const subcategorySlug = article.subcategories && article.subcategories.length > 0 && typeof article.subcategories[0] === 'object' ? article.subcategories[0].slug : 'general';

        return (article.slug && article.publicId)
            ? `/${categorySlug}/${subcategorySlug}/${article.slug}-${article.publicId}`
            : `/articles/${article._id}`;
    };

    return (
        <header className="z-50 bg-white group/header">
            {/* Top Utility Bar */}
            <div className="bg-[#2a2e35] text-white py-1.5 px-4 border-b border-zinc-800">
                <div className="container mx-auto flex justify-between items-center text-[11px] font-bold tracking-tight">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 py-1 border-r border-white/10 pr-6">
                            <Facebook className="w-4.5 h-4.5 hover:text-red-600 cursor-pointer transition-colors" />
                            <Instagram className="w-4.5 h-4.5 hover:text-red-600 cursor-pointer transition-colors" />
                            <Youtube className="w-4.5 h-4.5 hover:text-red-600 cursor-pointer transition-colors" />
                            <Twitter className="w-4.5 h-4.5 hover:text-red-600 cursor-pointer transition-colors" />
                        </div>
                        <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer group">
                            <Mail className="w-3.5 h-3.5 text-red-600" />
                            <span className="text-[15px] lowercase">admin@gmail.com</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-white/90 text-[15px]">{formattedDate}</span>
                        <div className="bg-red-600 px-3 py-1 font-mono text-[15px] font-black shadow-lg">
                            {formattedTime}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Branding Bar - Logo Left, Ad Right */}
            <div className="border-b border-zinc-100 p-5 md:py-6" >
                <div className="container mx-auto  px-0 flex flex-col lg:flex-row items-center justify-between gap-10 ">
                    {/* Logo Area */}
                    <div >
                        <Link to="/" className="flex flex-col items-start group">
                            <h1 className="text-2xl  md:text-5xl lg:text-3xl font-black tracking-tighter text-zinc-900 leading-none transform transition-transform group-hover:scale-[1.02] font-serif uppercase">
                                CHRONICLE
                            </h1>
                            <div className="flex items-center gap-2 mt-1 w-full">
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 whitespace-nowrap">Daily News Review</span>
                                <div className="flex-1 h-px bg-zinc-200" />
                            </div>
                        </Link>
                    </div>

                    {/* Dummy Header Ad Slot */}
                    <div className="hidden lg:flex flex-1 ml-95px max-w-[700px] h-[90px] bg-zinc-50 border border-zinc-100 items-center justify-center relative overflow-hidden group/ad shadow-inner ml-88 ">
                        <div className="absolute top-0 right-0 px-2 py-0.5 bg-zinc-200 text-[8px] font-bold uppercase tracking-widest text-zinc-400">Advertisement</div>
                        <img
                            src={ads[currentAdIndex].image}
                            alt={ads[currentAdIndex].alt}
                            className="w-full h-full object-cover"
                        />
                        {/* Animated subtle shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/ad:animate-[shimmer_2s_infinite]" />
                    </div>


                </div>
            </div>

            {/* Breaking News Ticker */}
            <div className="bg-zinc-900 text-white border-y border-zinc-800 py-1.5 overflow-hidden hidden md:block">
                <div className="container mx-auto px-4 flex items-center gap-6">
                    <div className="flex-shrink-0 flex items-center gap-2 px-4 py-1 bg-red-600 text-[10px] font-black uppercase tracking-[0.3em] italic animate-pulse">
                        <Rocket className="w-3.5 h-3.5 fill-current" />
                        Breaking News
                    </div>

                    <div className="flex-1 relative overflow-hidden mask-fade-edges h-6">
                        <div className="animate-infinite-scroll flex gap-12 whitespace-nowrap py-1" style={{ animationPlayState: isTickerPaused ? 'paused' : 'running' }}>
                            {latestArticles && [...latestArticles, ...latestArticles].map((article, idx) => (
                                <Link
                                    key={`${article._id}-${idx}`}
                                    to={getArticleLink(article)}
                                    className="flex items-center gap-3 text-[14px] font-bold uppercase tracking-wider hover:text-red-500 transition-colors group"
                                    onMouseEnter={() => setIsTickerPaused(true)}
                                    onMouseLeave={() => setIsTickerPaused(false)}
                                >
                                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full group-hover:scale-150 transition-transform" />
                                    {article.title}
                                </Link>
                            ))}
                            {!latestArticles && (
                                <div className="flex gap-12 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                                    <span>Loading the latest intelligence from around the globe...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation & Search Bar */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-4 border-zinc-950 shadow-xl overflow-x-auto relative">
                <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center h-full">
                        <nav className="hidden lg:flex items-center h-full">
                            <Link to="/" className="px-6 h-full flex items-center text-xs font-black uppercase tracking-widest border-r border-zinc-100 hover:text-red-600 hover:bg-zinc-50 transition-all">HOME</Link>
                            {!isCategoriesLoading && categories?.slice(0, 8).map((cat) => (
                                <DropdownMenu key={cat._id}>
                                    <DropdownMenuTrigger asChild>
                                        <button className="px-6 h-full flex items-center text-xs font-black uppercase tracking-widest border-r border-zinc-100 hover:text-red-600 hover:bg-zinc-50 transition-all outline-none">
                                            {cat.name}
                                            <ChevronDown className="ml-1 w-3 h-3" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="rounded-none border-4 border-zinc-950 p-4 w-64 shadow-2xl">
                                        <DropdownMenuItem asChild>
                                            <Link to={`/category/${cat.slug}`} className="font-black text-red-600 mb-2 block p-2">SEE ALL {cat.name}</Link>
                                        </DropdownMenuItem>
                                        {cat.subcategories?.map(sub => (
                                            <DropdownMenuItem key={sub._id} asChild>
                                                <Link to={`/subcategory/${cat.slug}/${sub.slug}`} className="p-2 font-bold hover:text-red-600">{sub.name}</Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ))}
                        </nav>
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-4">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex items-center gap-15">
                        <form onSubmit={handleSearch} className="hidden sm:flex items-center relative group">
                            <Search className="absolute left-4 w-6 h-6 text-zinc-400 group-focus-within:text-red-600 " />
                            <input
                                type="text"
                                placeholder="Quick Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 py-2 bg-transparent text-xs font-bold uppercase tracking-widest border-b border-transparent focus:border-red-600 focus:outline-none w-45 focus:w-84 transition-all"
                            />
                        </form>
                        <Button size="icon" variant="ghost" className="hover:text-red-600" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                            <Search className="w-5 h-5 sm:hidden" />
                        </Button>
                    </div>
                </div>

                {/* Mobile Search Overlay */}
                {isSearchOpen && (
                    <div className="absolute top-full left-0 w-full bg-white p-4 border-b-4 border-red-600 shadow-xl z-40 animate-in slide-in-from-top-2 sm:hidden">
                        <form onSubmit={handleSearch} className="flex items-center gap-4">
                            <Search className="w-5 h-5 text-red-600" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search headlines..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 text-lg font-bold uppercase tracking-tight outline-none placeholder:text-zinc-300"
                            />
                            <button type="button" onClick={() => setIsSearchOpen(false)}>
                                <X className="w-6 h-6 text-zinc-900" />
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Mobile Drawer */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="w-[85%] p-0 border-r-8 border-red-600">
                    <div className="bg-zinc-950 p-10 text-white">
                        <h1 className="text-4xl font-black font-serif italic mb-2 tracking-tighter">CHRONICLE</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Daily Intelligence</p>
                    </div>
                    <nav className="p-6 flex flex-col gap-2">
                        <Link to="/" className="text-2xl font-black p-4 border-b border-zinc-100 italic" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                        {!isCategoriesLoading && categories?.map(cat => (
                            <div key={cat._id} className="flex flex-col">
                                <Link to={`/category/${cat.slug}`} className="text-xl font-black p-4 uppercase tracking-tight flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                                    {cat.name}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </header>
    );
}
