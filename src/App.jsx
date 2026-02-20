import React from 'react';
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import ArticleDetail from "./pages/ArticleDetail";
import CategoryPage from "./pages/CategoryPage";
import SubcategoryPage from "./pages/SubcategoryPage";
import SearchPage from "./pages/SearchPage";
import AuthorProfile from "./pages/AuthorProfile";
import TagPage from "./pages/TagPage";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/utils/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/:category/:subcategory/:slugId" element={<ArticleDetail />} />
                    <Route path="/category/:category" element={<CategoryPage />} />
                    <Route path="/subcategory/:category/:subcategory" element={<SubcategoryPage />} />
                    <Route path="/author/:id" element={<AuthorProfile />} />
                    <Route path="/tags/:tag" element={<TagPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
