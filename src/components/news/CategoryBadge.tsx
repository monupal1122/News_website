import { Link } from 'react-router-dom';
import type { Category } from '@/lib/types';

interface CategoryBadgeProps {
  category: Category | string;
  linked?: boolean;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, linked = true, size = 'sm' }: CategoryBadgeProps) {
  const isObject = typeof category === 'object';
  const name = isObject ? category.name : category;
  const slug = isObject ? category.slug : category;

  const sizeClasses = size === 'sm'
    ? 'px-2.5 py-0.5 text-[10px]'
    : 'px-3 py-1 text-xs';

  const className = `inline-block rounded-full font-bold uppercase tracking-wider ${sizeClasses} bg-primary/10 text-primary border border-primary/20`;

  if (linked) {
    return (
      <Link
        to={`/category/${slug}`}
        className={`${className} hover:bg-primary/20 transition-all`}
      >
        {name}
      </Link>
    );
  }

  return <span className={className}>{name}</span>;
}
