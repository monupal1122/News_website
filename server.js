import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import https from 'https';
import { fileURLToPath } from 'url';
import prerender from 'prerender-node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configurations
const API_BASE_URL = "https://admin.korsimnaturals.com/api";
const SITE_URL = "https://korsimnaturals.com";
const IMAGE_BASE_URL = "https://admin.korsimnaturals.com";

// Helper to escape HTML and prevent injection
const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

// Helper to convert image URL to absolute
const toAbsoluteUrl = (img) => {
    if (img && !img.startsWith('http')) {
        const clean = img.replace(/^public[\\/]/, "").replace(/\\/g, "/");
        return `${IMAGE_BASE_URL}${clean.startsWith('/') ? clean : '/' + clean}`;
    } else if (!img || img === "") {
        return `${SITE_URL}/logo1.webp`;
    }
    return img;
};

// Custom bot detection
const isSocialBot = (ua) => {
    const list = ['linkedinbot', 'facebookexternalhit', 'facebot', 'twitterbot', 'whatsapp', 'telegrambot', 'slackbot', 'linkedin'];
    return list.some(bot => ua.toLowerCase().includes(bot));
};

// --- LOG ALL BOT VISITS ---
app.use((req, res, next) => {
    const ua = req.headers['user-agent'] || '';
    if (isSocialBot(ua)) {
        console.log(`[BOT-TRACE]: ${ua.substring(0, 50)} | URL: ${req.url}`);
    }
    next();
});

// --- MANUAL META TAG INJECTION (Priority: High) ---
// We handle this FIRST to avoid any Prerender interference for news articles
app.get('/:category/:subcategory/:slugId', async (req, res, next) => {
    const ua = req.headers['user-agent'] || '';
    if (!isSocialBot(ua)) return next();

    const { category, subcategory, slugId } = req.params;
    if (slugId.includes('.')) return next(); // Skip files

    console.log(`[SEO-INJECT]: Attempting injection for: ${slugId}`);

    const indexPath = path.join(__dirname, 'dist', 'index.html');
    const apiUri = `${API_BASE_URL}/articles/${category}/${subcategory}/${slugId}`;

    try {
        const options = { agent: new https.Agent({ rejectUnauthorized: false }) };
        https.get(apiUri, options, (apiRes) => {
            let body = '';
            apiRes.on('data', chunk => body += chunk);
            apiRes.on('end', () => {
                if (apiRes.statusCode === 200) {
                    try {
                        const rawData = JSON.parse(body);
                        const article = rawData.data || rawData.article || rawData;

                        const title = esc(`${article.title || "News"} | Daily News Views`);
                        const desc = esc((article.summary || article.description || "Read latest news updates...").substring(0, 160));
                        const canonical = `${SITE_URL}${req.path}`;
                        const img = toAbsoluteUrl(article.featuredImage || article.imageUrl);

                        console.log(`[SEO-SUCCESS]: Injected ${title}`);

                        const tags = `
    <!-- Dynamic Social SEO Injection -->
    <title>${title}</title>
    <meta name="description" content="${desc}">
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:image" content="${img}" />
    <meta property="og:image:secure_url" content="${img}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${img}" />
`;
                        let html = fs.readFileSync(indexPath, 'utf8');
                        html = html.replace('<head>', `<head>${tags}`);
                        return res.send(html);
                    } catch (e) {
                        console.error("[SEO-ERROR]: JSON Parse Error");
                        return res.send(fs.readFileSync(indexPath, 'utf8'));
                    }
                } else {
                    console.error(`[SEO-ERROR]: API Status ${apiRes.statusCode} for ${apiUri}`);
                    return res.send(fs.readFileSync(indexPath, 'utf8'));
                }
            });
        }).on('error', (e) => {
            console.error("[SEO-ERROR]: API Connection failed:", e.message);
            res.send(fs.readFileSync(indexPath, 'utf8'));
        });
    } catch (err) {
        res.sendFile(indexPath);
    }
});

// PRERENDER.IO for other pages (Home, Search, Tags, etc.)
prerender.set('prerenderToken', process.env.PRERENDER_TOKEN || 'MKc29XdWcppSm65HX6n4');
prerender.set('host', 'korsimnaturals.com');
prerender.shouldShowPrerender = (req) => isSocialBot(req.headers['user-agent'] || '');
app.use(prerender);

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend SEO Server running on port ${PORT}`);
    console.log(`API Base: ${API_BASE_URL}`);
});
