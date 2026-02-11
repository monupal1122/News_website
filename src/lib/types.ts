export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export interface Author {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  profileImage?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  articleCount?: number;
}

export interface Article {
  _id: string;
  publicId: number;
  title: string;
  slug: string;
  summary: string;
  description?: string; // Fallback for old data
  content: string;
  category: Category | string;
  subcategories: Subcategory[];
  featuredImage: string;
  imageUrl?: string; // Fallback for old data
  author: Author | string;
  tags: string[];
  publishedAt: string;
  sourceName: string;
  sourceUrl: string | null;
  viewCount: number;
  isFeatured: boolean;
  createdAt: string;
  publishStatus: 'draft' | 'pending' | 'published';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    return `${diffInMinutes} min ago`;
  }
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  if (diffInHours < 48) {
    return 'Yesterday';
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}
