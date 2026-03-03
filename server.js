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
    if (!img || img === "") return `${SITE_URL}/default.png`;
    if (img.startsWith('http')) return img;
    if (img.toLowerCase().includes('cloudinary.com')) return img;

    const clean = img.replace(/^public[\\/]/, "").replace(/\\/g, "/");
    return `${IMAGE_BASE_URL}${clean.startsWith('/') ? clean : '/' + clean}`;
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
        console.log(`[BOT-TRACE]: ${ua.substring(0, 50)}... | URL: ${req.url}`);
    }
    next();
});

// --- DEBUG ROUTE ---
// Visit https://korsimnaturals.com/__test_seo to verify the server is active
app.get('/__test_seo', (req, res) => {
    res.send(`<h1>SEO Server is Active</h1><p>API: ${API_BASE_URL}</p><p>Time: ${new Date().toISOString()}</p>`);
});

// --- MANUAL META TAG INJECTION ---
// Match: /category/subcategory/slug-id
app.get('/:category/:subcategory/:slugId', async (req, res, next) => {
    const ua = req.headers['user-agent'] || '';
    const { category, subcategory, slugId } = req.params;

    // Skip if not a bot or if it looks like a file (has dot)
    if (!isSocialBot(ua) || slugId.includes('.')) {
        return next();
    }

    console.log(`[SEO-INJECT]: Processing injection for: ${slugId}`);

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

                        const title = esc(`${article.title || "News Article"} | Daily News Views`);
                        const desc = esc((article.summary || article.description || "Read the latest news on Daily News Views").substring(0, 160));
                        const canonical = `${SITE_URL}${req.path}`;
                        const img = toAbsoluteUrl(article.featuredImage || article.imageUrl);

                        console.log(`[SEO-SUCCESS]: Injected tags for: ${title}`);

                        const tags = `
    <!-- START: Dynamic Meta Tags -->
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
    <!-- END: Dynamic Meta Tags -->
`;
                        let html = fs.readFileSync(indexPath, 'utf8');
                        // Inject into head, but also remove existing title if possible
                        html = html.replace(/<title>.*?<\/title>/i, '');
                        html = html.replace('<head>', `<head>${tags}`);

                        return res.send(html);
                    } catch (e) {
                        console.error("[SEO-ERROR]: JSON Parse Error on Article Data");
                        res.write(`<!-- SEO Injection Error: JSON Parse -->\n`);
                        res.end(fs.readFileSync(indexPath, 'utf8'));
                    }
                } else {
                    console.error(`[SEO-ERROR]: API returned ${apiRes.statusCode} for ${apiUri}`);
                    res.write(`<!-- SEO Injection Error: API Status ${apiRes.statusCode} -->\n`);
                    res.end(fs.readFileSync(indexPath, 'utf8'));
                }
            });
        }).on('error', (e) => {
            console.error("[SEO-ERROR]: API Connection failed:", e.message);
            res.write(`<!-- SEO Injection Error: API Connection Failed -->\n`);
            res.end(fs.readFileSync(indexPath, 'utf8'));
        });
    } catch (err) {
        res.sendFile(indexPath);
    }
});

// PRERENDER.IO for other pages
prerender.set('prerenderToken', process.env.PRERENDER_TOKEN || 'MKc29XdWcppSm65HX6n4');
prerender.set('host', 'korsimnaturals.com');
prerender.shouldShowPrerender = (req) => isSocialBot(req.headers['user-agent'] || '');
app.use(prerender);

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Catch-all
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend Node Server running on port ${PORT}`);
    console.log(`API Base: ${API_BASE_URL}`);
});
