import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import type { Article, Author } from '@/lib/types';

export function useTopHeadlines(limit = 10) {
  return useQuery({
    queryKey: ['articles', 'top-headlines', limit],
    queryFn: async () => {
      const data = await fetchApi(`/articles?limit=${limit}`);
      return data.articles as Article[];
    },
  });
}

export function useFeaturedArticles(limit = 5) {
  return useQuery({
    queryKey: ['articles', 'featured', limit],
    queryFn: async () => {
      return fetchApi('/articles/featured') as Promise<Article[]>;
    },
  });
}

export function useTrendingArticles(limit = 5) {
  return useQuery({
    queryKey: ['articles', 'trending', limit],
    queryFn: async () => {
      // Backend doesn't have a specific trending endpoint, using general articles for now or views-based
      const data = await fetchApi(`/articles?limit=${limit}&sort=views`);
      return data.articles as Article[];
    },
  });
}

export function useArticlesByCategory(category: string, limit = 20) {
  return useQuery({
    queryKey: ['articles', 'category', category, limit],
    queryFn: async () => {
      return fetchApi(`/articles/category/${category}?limit=${limit}`) as Promise<Article[]>;
    },
  });
}

export function useArticlesBySubcategory(categorySlug: string, subcategorySlug: string, limit = 20) {
  return useQuery({
    queryKey: ['articles', 'subcategory', categorySlug, subcategorySlug, limit],
    queryFn: async () => {
      return fetchApi(`/articles/subcategory/${categorySlug}/${subcategorySlug}?limit=${limit}`) as Promise<Article[]>;
    },
  });
}

export function useArticle(seoPath: string) {
  return useQuery({
    queryKey: ['articles', 'single', seoPath],
    queryFn: async () => {
      return fetchApi(`/articles/${seoPath}`) as Promise<Article>;
    },
    enabled: !!seoPath,
  });
}

export function useSearchArticles(query: string, limit = 20) {
  return useQuery({
    queryKey: ['articles', 'search', query, limit],
    queryFn: async () => {
      if (!query.trim()) return [];
      return fetchApi(`/articles/search?q=${query}&limit=${limit}`) as Promise<Article[]>;
    },
    enabled: query.length > 0,
  });
}

export function useRelatedArticles(article: Article | null, limit = 4) {
  return useQuery({
    queryKey: ['articles', 'related', article?._id, limit],
    queryFn: async () => {
      if (!article) return [];
      // Use category for related articles
      const categoryId = typeof article.category === 'object' ? (article.category as any)._id : article.category;
      return fetchApi(`/articles/category/${categoryId}?limit=${limit}`) as Promise<Article[]>;
    },
    enabled: !!article,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories', 'full'],
    queryFn: async () => {
      return fetchApi('/categories/full');
    },
  });
}

export function useAuthorInfo(id: string) {
  return useQuery({
    queryKey: ['authors', id],
    queryFn: async () => {
      return fetchApi(`/authors/${id}`) as Promise<Author>;
    },
    enabled: !!id,
  });
}

export function useAuthorArticles(id: string, limit = 20) {
  return useQuery({
    queryKey: ['articles', 'author', id, limit],
    queryFn: async () => {
      return fetchApi(`/articles/author/${id}?limit=${limit}`) as Promise<Article[]>;
    },
    enabled: !!id,
  });
}

export function useArticlesByTag(tag: string, limit = 20) {
  return useQuery({
    queryKey: ['articles', 'tag', tag, limit],
    queryFn: async () => {
      return fetchApi(`/articles/tag/${tag}?limit=${limit}`) as Promise<Article[]>;
    },
    enabled: !!tag,
  });
}
