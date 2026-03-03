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

// PRERENDER.IO CONFIGURATION
prerender.set('prerenderToken', process.env.PRERENDER_TOKEN || 'MKc29XdWcppSm65HX6n4');
prerender.set('host', 'korsimnaturals.com');
prerender.set('debug', true);

// Custom bot detection for Prerender and for our manual fallback
const isSocialBot = (ua) => {
    const list = ['linkedinbot', 'facebookexternalhit', 'facebot', 'twitterbot', 'whatsapp', 'telegrambot', 'slackbot'];
    return list.some(bot => ua.toLowerCase().includes(bot));
};

prerender.shouldShowPrerender = (req) => isSocialBot(req.headers['user-agent'] || '');
app.use(prerender);

// Helper to escape HTML and prevent injection
const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;');

// --- MANUAL META TAG INJECTION (The "Safety Net") ---
// This ensures that even if Prerender fails, we serve correct tags to bots
app.get('/:category/:subcategory/:slugId', async (req, res, next) => {
    const ua = req.headers['user-agent'] || '';
    const { category, subcategory, slugId } = req.params;
    const indexPath = path.join(__dirname, 'dist', 'index.html');

    // Only inject for social bots and only if it's not a file request (like .js or .css)
    if (!isSocialBot(ua) || slugId.includes('.')) {
        return next();
    }

    console.log(`[SEO-INJECT]: Bot detected ${ua}. Injecting for: ${req.url}`);

    try {
        // Fetch article data
        const apiUri = `${API_BASE_URL}/articles/${category}/${subcategory}/${slugId}`;
        https.get(apiUri, (apiRes) => {
            let body = '';
            apiRes.on('data', chunk => body += chunk);
            apiRes.on('end', () => {
                let html = fs.readFileSync(indexPath, 'utf8');

                if (apiRes.statusCode === 200) {
                    try {
                        const article = JSON.parse(body);
                        const title = esc(`${article.title} | Daily News Views`);
                        const desc = esc((article.summary || article.description || "").substring(0, 160));
                        const canonical = `${SITE_URL}${req.url}`;

                        let img = article.featuredImage || article.imageUrl;
                        if (img && !img.startsWith('http')) {
                            const clean = img.replace(/^public[\\/]/, "").replace(/\\/g, "/");
                            img = `${IMAGE_BASE_URL}${clean.startsWith('/') ? clean : '/' + clean}`;
                        } else if (!img) {
                            img = `${SITE_URL}/logo1.webp`;
                        }

                        const tags = `
    <!-- Dynamic SEO Injection -->
    <title>${title}</title>
    <meta name="description" content="${desc}">
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:image" content="${img}" />
    <meta name="image" property="og:image" content="${img}">
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${img}" />
`;
                        html = html.replace('<head>', `<head>${tags}`);
                    } catch (e) {
                        console.error("JSON Parsing Error during injection");
                    }
                }
                res.send(html);
            });
        }).on('error', (e) => {
            console.error("API error during injection:", e.message);
            res.sendFile(indexPath);
        });
    } catch (err) {
        res.sendFile(indexPath);
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend SEO Server running on port ${PORT}`);
});
