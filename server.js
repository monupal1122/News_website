import express from "express";
import fs from "fs";
import path from "path";
import axios from "axios";

const app = express();
const PORT = 3000;

const SITE_URL = "https://korsimnaturals.com";
const API_URL = "https://admin.korsimnaturals.com/api";

// Comprehensive bot detection - covers all major social media and search bots
const isBot = (ua) => {
  if (!ua) return false;
  
  const uaLower = ua.toLowerCase();
  
  const bots = [
    // Facebook / Meta
    "facebookexternalhit",
    "facebookcatalog",
    
    // Twitter / X
    "twitterbot",
    "xbot",
    
    // LinkedIn
    "linkedinbot",
    "linkedin",
    
    // WhatsApp
    "whatsapp",
    
    // Telegram
    "telegrambot",
    
    // Pinterest
    "pinterest",
    "pinterestbot",
    
    // Discord / Slack
    "discord",
    "slackbot",
    "slack",
    
    // Apple
    "applebot",
    "apple news",
    "applewebkit", // Safari/AppleNews
    
    // Google
    "googlebot",
    "google-inspectiontool",
    "googleother",
    "google-stackdriver",
    "feedfetcher-google",
    
    // Bing
    "bingbot",
    "bingpreview",
    
    // Yahooahoo!
    "y",
    "yandexbot",
    
    // DuckDuckGo
    "duckduckbot",
    
    // Reddit
    "redditbot",
    
    // Skype
    "skype",
    
    // TikTok
    "tiktok",
    
    // OEmbed
    "oembed",
    
    // General SEO bots
    "bot",
    "crawler",
    "spider",
    "scraper"
  ];
  
  // Check for exact matches first
  const exactMatches = [
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "whatsapp",
    "telegrambot",
    "googlebot",
    "bingbot",
    "pinterest",
    "discordbot",
    "slackbot"
  ];
  
  // If any exact match found, return true
  for (const bot of exactMatches) {
    if (uaLower.includes(bot)) return true;
  }
  
  // Check for partial matches (more permissive)
  return bots.some(bot => uaLower.includes(bot));
};

// Input validation for URL parameters
const isValidSlug = (slug) => {
  // Allow alphanumeric, hyphens, and underscores
  return /^[a-zA-Z0-9-_]+$/.test(slug);
};

const isValidCategory = (category) => {
  return /^[a-zA-Z0-9-_]+$/.test(category);
};

// Helper function to extract author name from populated author object
const getAuthorName = (author) => {
  if (!author) return "Daily Chronicle";
  if (typeof author === 'string') return author;
  return author.name || author.username || "Daily Chronicle";
};

// Cache for article data (in-memory, 5 minutes TTL)
const articleCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedArticle = async (key) => {
  const cached = articleCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  articleCache.delete(key);
  return null;
};

const setCachedArticle = (key, data) => {
  articleCache.set(key, { data, timestamp: Date.now() });
  
  // Clean old entries if cache is too large
  if (articleCache.size > 100) {
    const firstKey = articleCache.keys().next().value;
    articleCache.delete(firstKey);
  }
};

// SEO Meta tag injection route - MUST be before static middleware
app.get("/:category/:subcategory/:slugId", async (req, res, next) => {
  const ua = req.headers["user-agent"] || "";
  
  // Only process requests from bots
  if (!isBot(ua)) {
    return next();
  }
  
  const { category, subcategory, slugId } = req.params;
  
  // Input validation
  if (!isValidCategory(category) || !isValidCategory(subcategory) || !isValidSlug(slugId)) {
    console.log("Invalid URL parameters:", { category, subcategory, slugId });
    return next();
  }
  
  const cacheKey = `${category}/${subcategory}/${slugId}`;
  
  try {
    // Try to get from cache first
    let article = await getCachedArticle(cacheKey);
    
    if (!article) {
      // Fetch from API
      const apiUrl = `${API_URL}/articles/${category}/${subcategory}/${slugId}`;
      
      const response = await axios.get(apiUrl, {
        timeout: 5000, // 5 second timeout
        headers: {
          'User-Agent': ua
        }
      });
      
      // Handle both wrapped and unwrapped responses
      article = response.data.data || response.data;
      
      if (!article) {
        return res.status(404).send("Article not found");
      }
      
      // Cache the article
      setCachedArticle(cacheKey, article);
    }
    
    // Validate article has required fields
    if (!article || !article.title) {
      return res.status(404).send("Article not found");
    }
    
    // Extract article data
    const title = article.seoMetadata?.title || article.title;
    const description = article.seoMetadata?.description || article.summary || article.description || "";
    const image = article.featuredImage || article.featuredImage || "";
    const authorName = getAuthorName(article.author);
    const publishedAt = article.publishedAt || article.createdAt;
    const updatedAt = article.updatedAt;
    
    // Generate the canonical URL
    const currentUrl = `${SITE_URL}${req.path}`;
    const canonicalUrl = currentUrl;
    
    // Truncate description if too long
    const truncatedDescription = description.length > 200 
      ? description.substring(0, 197) + "..." 
      : description;
    
    // Format date for Open Graph
    const formatDate = (date) => {
      if (!date) return new Date().toISOString();
      return new Date(date).toISOString();
    };
    
    // Get image dimensions if available
    const imageWidth = article.featuredImageWidth || 1200;
    const imageHeight = article.featuredImageHeight || 630;
    
    // Generate comprehensive meta tags
    const metaTags = `
      <title>${title}</title>
      <link rel="canonical" href="${canonicalUrl}" />
      <meta name="description" content="${truncatedDescription}" />
      
      <!-- Open Graph / Facebook -->
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${truncatedDescription}" />
      <meta property="og:image" content="${image}" />
      <meta property="og:image:url" content="${image}" />
      <meta property="og:image:secure_url" content="${image}" />
      <meta property="og:image:width" content="${imageWidth}" />
      <meta property="og:image:height" content="${imageHeight}" />
      <meta property="og:image:alt" content="${title}" />
      <meta property="og:url" content="${canonicalUrl}" />
      <meta property="og:type" content="article" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="Daily Chronicle" />
      
      <!-- Article specific Open Graph -->
      <meta property="article:published_time" content="${formatDate(publishedAt)}" />
      <meta property="article:modified_time" content="${formatDate(updatedAt)}" />
      <meta property="article:author" content="${authorName}" />
      <meta property="article:section" content="${category}" />
      ${article.tags ? article.tags.map(tag => `<meta property="article:tag" content="${tag}" />`).join('\n      ') : ''}
      
      <!-- Twitter Card -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@dailychronicle" />
      <meta name="twitter:creator" content="@dailychronicle" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${truncatedDescription}" />
      <meta name="twitter:image" content="${image}" />
      <meta name="twitter:image:alt" content="${title}" />
      <meta name="twitter:url" content="${canonicalUrl}" />
      
      <!-- LinkedIn specific -->
      <meta property="linkedin:owner" content="dailychronicle" />
      
      <!-- WhatsApp / Telegram (uses Open Graph) -->
      <meta property="og:see_also" content="${SITE_URL}" />
    `;
    
    // Read the index.html file
    const indexPath = path.join(process.cwd(), "dist/index.html");
    
    let html;
    try {
      html = fs.readFileSync(indexPath, "utf8");
    } catch (err) {
      console.error("Error reading index.html:", err);
      return res.status(500).send("Internal Server Error");
    }
    
    // Inject meta tags into <head>
    html = html.replace(/<head>/i, `<head>${metaTags}`);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Robots-Tag', 'index, follow');
    
    // Send the modified HTML
    res.send(html);
    
  } catch (err) {
    // Log error for debugging
    console.error("SEO Server Error:", {
      message: err.message,
      code: err.code,
      category,
      subcategory,
      slugId,
      userAgent: ua
    });
    
    // If article not found (404 from API), return 404
    if (err.response?.status === 404) {
      return res.status(404).send("Article not found");
    }
    
    // For other errors, fall through to next handler (serve React app)
    next();
  }
});

// Serve static files from dist directory
app.use(express.static("dist"));

// Also try to serve from dist folder if it exists in parent
const distPath = path.join(process.cwd(), "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Fallback to React app for all other routes (SPA)
app.get("*", (req, res) => {
  const indexPath = path.join(process.cwd(), "dist/index.html");
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // If dist doesn't exist, return a simple HTML page
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Daily Chronicle</title>
      </head>
      <body>
        <div id="root">
          <h1>Daily Chronicle</h1>
          <p>Loading...</p>
        </div>
      </body>
      </html>
    `);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).send("Internal Server Error");
});

app.listen(PORT, () => {
  console.log("SEO Server running on port", PORT);
  console.log("Bot detection enabled for:", [
    "Facebook", "Twitter", "LinkedIn", "WhatsApp", 
    "Telegram", "Pinterest", "Discord", "Slack",
    "Google", "Bing", "Yahoo", "DuckDuckGo"
  ].join(", "));
});

export default app;
