import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Moon, Sun, ChevronDown, Rocket, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCategories } from '@/hooks/useArticles';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category } from '@/lib/types';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { data: categories, isLoading } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
      <div className="container mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-20 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                <Newspaper className="text-primary-foreground w-7 h-7" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter font-serif leading-none">CHRONICLE</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground leading-none mt-1">Daily Intelligence</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-lg mx-12">
            <div className="relative w-full group">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors z-20 pointer-events-none" />
              <Input
                type="text"
                placeholder="Explore the latest stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative z-10 w-full pl-12 pr-12 h-12 bg-muted/30 border-none rounded-full focus-visible:ring-2 focus-visible:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-focus-within:opacity-100 transition-opacity hover:bg-primary/90 z-20"
              >
                <Rocket className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-muted/50 rounded-xl"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className="hover:bg-muted/50 rounded-xl transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Subscribe Button (Visual Only) */}
            <Button className="hidden sm:flex rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              Subscribe
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden hover:bg-muted/50 rounded-xl">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] border-l border-border/50">
                <div className="flex flex-col h-full py-6">
                  <div className="flex items-center gap-3 px-2 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                      <Newspaper className="text-primary-foreground w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold font-serif">Chronicle</span>
                  </div>

                  <nav className="flex flex-col gap-2">
                    <Link
                      to="/"
                      className="px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors font-semibold text-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Home
                    </Link>

                    <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mt-4">
                      Categories
                    </div>

                    {!isLoading && categories?.map((cat: Category) => (
                      <div key={cat._id} className="flex flex-col">
                        <Link
                          to={`/category/${cat.slug}`}
                          className="px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors font-medium flex items-center justify-between"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {cat.name}
                        </Link>
                        {cat.subcategories?.map(sub => (
                          <Link
                            key={sub._id}
                            to={`/subcategory/${sub.slug}`}
                            className="px-8 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            • {sub.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Input */}
        {isSearchOpen && (
          <form onSubmit={handleSearch} className="lg:hidden px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary z-20 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative z-10 w-full pl-12 pr-12 h-12 bg-muted/50 border-none rounded-2xl"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center z-20"
              >
                <Rocket className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Desktop Category Nav */}
        <nav className="hidden lg:flex items-center gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-primary/5 text-primary text-sm font-bold hover:bg-primary/10 transition-colors whitespace-nowrap"
          >
            Latest News
          </Link>

          <div className="w-px h-4 bg-border/50 mx-2" />

          {!isLoading && categories?.map((cat: Category) => (
            <DropdownMenu key={cat._id}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-muted/50 transition-all text-sm font-semibold text-muted-foreground hover:text-foreground group">
                  {cat.name}
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 p-2 rounded-2xl border-border/50 backdrop-blur-xl bg-background/95 shadow-2xl shadow-primary/5">
                <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/5 cursor-pointer">
                  <Link to={`/category/${cat.slug}`} className="font-bold text-primary">View All {cat.name}</Link>
                </DropdownMenuItem>
                <div className="h-px bg-border/50 my-1 mx-1" />
                {cat.subcategories?.map(sub => (
                  <DropdownMenuItem key={sub._id} asChild className="rounded-xl focus:bg-muted cursor-pointer">
                    <Link to={`/subcategory/${sub.slug}`}>{sub.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}

          <div className="flex-1" />

          <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground px-4">
            <div className="flex items-center gap-2 text-primary animate-pulse">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Live: G7 Summit
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
