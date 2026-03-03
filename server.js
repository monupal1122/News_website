import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Configuration ────────────────────────────────────────────────────────────
const API_BASE_URL = "https://admin.korsimnaturals.com/api";
const SITE_URL     = "https://korsimnaturals.com";
const IMAGE_BASE_URL = "https://admin.korsimnaturals.com";

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Escape HTML to prevent injection attacks in meta tags
const esc = (s) =>
  (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#039;");

// Convert any image URL to an absolute HTTPS URL
const toAbsoluteUrl = (img) => {
  if (!img || img.trim() === "") return `${SITE_URL}/default.png`;
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  if (img.toLowerCase().includes("cloudinary.com")) return img;
  const clean = img.replace(/^public[\\/]/, "").replace(/\\/g, "/");
  return `${IMAGE_BASE_URL}${clean.startsWith("/") ? clean : "/" + clean}`;
};

// Detect social media / SEO bots by User-Agent
const isSocialBot = (ua = "") => {
  const bots = [
    "linkedinbot",
    "facebookexternalhit",
    "facebot",
    "twitterbot",
    "whatsapp",
    "telegrambot",
    "slackbot",
    "googlebot",          // ✅ FIX 1: Added Googlebot for SEO
    "bingbot",            // ✅ FIX 2: Added Bingbot for SEO
    "applebot",
    "discordbot",
    "embedly",
    "skypeuripreview",
    "pinterest",
  ];
  return bots.some((bot) => ua.toLowerCase().includes(bot));
};

// ─── Log all bot visits ───────────────────────────────────────────────────────
app.use((req, res, next) => {
  const ua = req.headers["user-agent"] || "";
  if (isSocialBot(ua)) {
    console.log(`[BOT] ${ua.substring(0, 80)} → ${req.url}`);
  }
  next();
});

// ─── Debug route ──────────────────────────────────────────────────────────────
// Visit https://korsimnaturals.com/__test_seo to verify server is working
app.get("/__test_seo", (req, res) => {
  res.send(`
    <h1>✅ SEO Server Active</h1>
    <p>API: ${API_BASE_URL}</p>
    <p>Time: ${new Date().toISOString()}</p>
    <p>Test bot inject: <a href="/__test_bot">/__test_bot</a></p>
  `);
});

// ─── Test route: simulate a bot visit ────────────────────────────────────────
// Visit https://korsimnaturals.com/__test_bot?url=/your-category/sub/slug
app.get("/__test_bot", (req, res) => {
  const testUrl = req.query.url || "/test-category/test-sub/test-slug";
  res.send(`
    <h1>Bot Simulation</h1>
    <p>To test OG injection, run this in terminal:</p>
    <pre>curl -A "facebookexternalhit/1.1" https://korsimnaturals.com${testUrl}</pre>
    <p>You should see injected meta tags in the HTML output.</p>
  `);
});

// ─── OG Meta Tag Injection for Social Bots ───────────────────────────────────
// Matches article URLs: /:category/:subcategory/:slugId
app.get("/:category/:subcategory/:slugId", async (req, res, next) => {
  const ua = req.headers["user-agent"] || "";
  const { category, subcategory, slugId } = req.params;

  // ✅ FIX 3: Only skip files with extensions (e.g. .js, .css, .png)
  // But still serve bots even for long slugs
  if (slugId.includes(".")) return next();

  // ✅ FIX 4: Serve ALL requests (not just bots) with OG tags
  // This ensures even manual curl tests and prerender services work
  // Normal browsers will still get the React app with OG tags in <head>

  const indexPath = path.join(__dirname, "dist", "index.html");

  // ✅ FIX 5: Check index.html exists before proceeding
  if (!fs.existsSync(indexPath)) {
    console.error("[SEO-ERROR]: dist/index.html not found!");
    return next();
  }

  // ✅ FIX 6: Decode URI components so Hindi/non-ASCII slugs work correctly
  const decodedCategory   = decodeURIComponent(category);
  const decodedSubcategory = decodeURIComponent(subcategory);
  const decodedSlugId     = decodeURIComponent(slugId);

  const apiUri = `${API_BASE_URL}/articles/${encodeURIComponent(decodedCategory)}/${encodeURIComponent(decodedSubcategory)}/${encodeURIComponent(decodedSlugId)}`;

  console.log(`[SEO-INJECT]: Fetching → ${apiUri}`);

  const options = {
    agent: new https.Agent({ rejectUnauthorized: false }),
    // ✅ FIX 7: Add timeout so slow API doesn't hang the response
    timeout: 5000,
  };

  const fallback = () => {
    try {
      return res.sendFile(indexPath);
    } catch {
      return next();
    }
  };

  try {
    const request = https.get(apiUri, options, (apiRes) => {
      let body = "";
      apiRes.on("data", (chunk) => (body += chunk));
      apiRes.on("end", () => {
        if (apiRes.statusCode === 200) {
          try {
            const rawData  = JSON.parse(body);
            // ✅ FIX 8: Handle all common API response shapes
            const article  = rawData.data || rawData.article || rawData;

            const pageTitle  = `${article.title || "News Article"} | Korsim Naturals`;
            const pageDesc   = (article.summary || article.description || "Read the latest news on Korsim Naturals").substring(0, 160);
            const canonical  = `${SITE_URL}${req.path}`;

            // ✅ FIX 9: toAbsoluteUrl ensures image is always a full HTTPS URL
            const img = toAbsoluteUrl(article.featuredImage || article.imageUrl);

            console.log(`[SEO-SUCCESS]: "${pageTitle}" | img: ${img}`);

            // ✅ FIX 10: og:image:width/height added — required by LinkedIn & Facebook
            const tags = `
  <!-- SEO: Dynamic Meta Tags Start -->
  <title>${esc(pageTitle)}</title>
  <meta name="description"          content="${esc(pageDesc)}" />
  <link rel="canonical"             href="${canonical}" />

  <meta property="og:type"          content="article" />
  <meta property="og:site_name"     content="Korsim Naturals" />
  <meta property="og:title"         content="${esc(pageTitle)}" />
  <meta property="og:description"   content="${esc(pageDesc)}" />
  <meta property="og:url"           content="${canonical}" />
  <meta property="og:image"         content="${img}" />
  <meta property="og:image:secure_url" content="${img}" />
  <meta property="og:image:width"   content="1200" />
  <meta property="og:image:height"  content="630" />
  <meta property="og:image:alt"     content="${esc(article.title || "")}" />

  <meta name="twitter:card"         content="summary_large_image" />
  <meta name="twitter:title"        content="${esc(pageTitle)}" />
  <meta name="twitter:description"  content="${esc(pageDesc)}" />
  <meta name="twitter:image"        content="${img}" />
  <meta name="twitter:image:alt"    content="${esc(article.title || "")}" />
  <meta name="twitter:url"          content="${canonical}" />
  <!-- SEO: Dynamic Meta Tags End -->
`;

            let html = fs.readFileSync(indexPath, "utf8");

            // ✅ FIX 11: Remove existing <title> tag then inject all tags into <head>
            html = html.replace(/<title>.*?<\/title>/is, "");
            html = html.replace("<head>", `<head>\n${tags}`);

            res.setHeader("Content-Type", "text/html; charset=utf-8");
            return res.send(html);

          } catch (parseErr) {
            console.error("[SEO-ERROR]: JSON parse failed:", parseErr.message);
            return fallback();
          }
        } else {
          console.error(`[SEO-ERROR]: API returned HTTP ${apiRes.statusCode} for ${apiUri}`);
          return fallback();
        }
      });
    });

    // ✅ FIX 12: Handle request timeout gracefully
    request.on("timeout", () => {
      console.error("[SEO-ERROR]: API request timed out");
      request.destroy();
      return fallback();
    });

    request.on("error", (e) => {
      console.error("[SEO-ERROR]: API connection failed:", e.message);
      return fallback();
    });

  } catch (err) {
    console.error("[SEO-ERROR]: Unexpected error:", err.message);
    return fallback();
  }
});

// ─── Static files ─────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "dist")));

// ─── SPA catch-all ────────────────────────────────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`   Site:     ${SITE_URL}`);
  console.log(`   API:      ${API_BASE_URL}`);
  console.log(`   Test SEO: ${SITE_URL}/__test_seo`);
});