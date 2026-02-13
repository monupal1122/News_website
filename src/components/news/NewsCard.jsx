import { Link } from 'react-router-dom';
import { Clock, Eye, User, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/types';
import { CategoryBadge } from './CategoryBadge';

export function NewsCard({ article, variant = 'default' }) {
    const categorySlug = typeof article.category === 'object' ? article.category.slug : 'uncategorized';
    const subcategorySlug = article.subcategories && article.subcategories.length > 0 && typeof article.subcategories[0] === 'object' ? article.subcategories[0].slug : 'general';

    const authorName = typeof article.author === 'object' ? article.author.name : (article.author || 'Editorial Team');
    const imageSrc = article.featuredImage || article.imageUrl || 'https://images.unsplash.com/photo-1504711432869-efd597cdd04b?q=80&w=1000&auto=format&fit=crop';
    const excerpt = article.summary || article.description;

    const articleLink = (article.slug && article.publicId)
        ? `/${categorySlug}/${subcategorySlug}/${article.slug}-${article.publicId}`
        : `/articles/${article._id}`;

    if (variant === 'featured') {
        return (
            <Link to={articleLink} className="group block h-full bg-white hover:bg-zinc-50 transition-colors">
                <div className="flex flex-col lg:flex-row h-full">
                    {/* Image Side */}
                    <div className="lg:w-7/12 relative aspect-[4/3] lg:aspect-auto overflow-hidden bg-zinc-200">
                        <img
                            src={imageSrc}
                            alt={article.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>

                    {/* Content Side */}
                    <div className="lg:w-5/12 p-6 lg:p-10 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-zinc-100">
                        <div className="flex items-center gap-3 mb-4">
                            <CategoryBadge category={article.category} />
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                {formatDate(article.publishedAt || article.createdAt)}
                            </span>
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-zinc-900 leading-[1.2] mb-6 group-hover:text-red-700 transition-colors">
                            {article.title}
                        </h2>

                        <p className="text-zinc-600 text-lg leading-relaxed line-clamp-4 lg:line-clamp-6 font-sans mb-8">
                            {excerpt}
                        </p>

                        <div className="mt-auto flex items-center gap-3 text-sm font-bold text-zinc-900 uppercase tracking-widest group-hover:gap-4 transition-all">
                            Read Full Story <ArrowRight className="w-4 h-4 text-red-600" />
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    if (variant === 'horizontal') {
        return (
            <Link to={articleLink} className="group flex gap-6 p-5 hover:bg-zinc-50 transition-all border-b border-zinc-100 last:border-0 relative bg-white">
                <div className="flex-shrink-0 w-32 h-24 md:w-52 md:h-32 overflow-hidden relative">
                    <img
                        src={imageSrc}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 border-[8px] border-white/0 group-hover:border-white/20 transition-all" />
                </div>
                <div className="flex flex-col justify-center min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-1 h-3 bg-red-600 rounded-full" />
                        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.15em]">
                            {typeof article.category === 'object' ? article.category.name : categorySlug}
                        </span>
                    </div>
                    <h4 className="font-black text-base md:text-xl text-zinc-900 leading-[1.5] line-clamp-2 group-hover:text-red-600 transition-colors tracking-tight py-1">
                        {article.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-red-600" /> {formatDate(article.publishedAt || article.createdAt)}</span>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <div className="group relative bg-white overflow-hidden flex flex-col h-full hover:bg-zinc-50 transition-colors">
            <Link to={articleLink} className="relative aspect-[16/9] overflow-hidden bg-zinc-200 block mb-4">
                <img
                    src={imageSrc}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </Link>
            <div className="flex flex-col flex-1">
                <Link to={articleLink} className="block">
                    <h3 className="font-serif font-bold text-xl md:text-2xl leading-tight text-zinc-900 group-hover:text-red-700 transition-colors mb-3">
                        {article.title}
                    </h3>
                </Link>
                <p className="text-zinc-600 text-[15px] leading-relaxed line-clamp-2 mb-4 font-sans">
                    {excerpt}
                </p>
                <div className="mt-auto flex items-center text-xs text-zinc-500 font-medium">
                    <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                    <span className="mx-2">•</span>
                    <span>{article.readTime || '2 min'} read</span>
                </div>
            </div>
        </div>
    );
}
