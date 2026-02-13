import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';

const ArticleContext = createContext(undefined);

export const ArticleProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
    const [topHeadlines, setTopHeadlines] = useState([]);
    const [isHeadlinesLoading, setIsHeadlinesLoading] = useState(true);

    const fetchCategories = async () => {
        setIsCategoriesLoading(true);
        try {
            const data = await fetchApi('/categories/full');
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setIsCategoriesLoading(false);
        }
    };

    const fetchHeadlines = async () => {
        setIsHeadlinesLoading(true);
        try {
            const data = await fetchApi('/articles?limit=10');
            setTopHeadlines(data.articles || []);
        } catch (error) {
            console.error('Failed to fetch headlines:', error);
        } finally {
            setIsHeadlinesLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchHeadlines();
    }, []);

    return (
        <ArticleContext.Provider value={{
            categories,
            isCategoriesLoading,
            topHeadlines,
            isHeadlinesLoading,
            refreshCategories: fetchCategories
        }}>
            {children}
        </ArticleContext.Provider>
    );
};

export const useArticleContext = () => {
    const context = useContext(ArticleContext);
    if (context === undefined) {
        throw new Error('useArticleContext must be used within an ArticleProvider');
    }
    return context;
};
