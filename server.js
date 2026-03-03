import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Configuration ────────────────────────────────────────────────────────────
const API_BASE_URL   = "https://admin.korsimnaturals.com/api";
const SITE_URL       = "https://korsimnaturals.com";
const IMAGE_BASE_URL = "https://admin.korsimnaturals.com";

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Escape HTML to prevent XSS in meta tags
const esc = (s) =>
  (s || "")
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#039;");

// Convert any image URL to absolute HTTPS
const toAbsoluteUrl = (img) => {
  if (!img || img.trim() === "") return `${SITE_URL}/default.png`;
  if (img.startsWith("https://") || img.startsWith("http://")) return img;
  if (img.toLowerCase().includes("cloudinary.com")) return img;
  const clean = img.replace(/^public[\\/]/, "").replace(/\\/g, "/");
  return `${IMAGE_BASE_URL}${clean.startsWith("/") ? clean : "/" + clean}`;
};

// Detect social media bots by User-Agent
const isSocialBot = (ua = "") => {
  const bots = [
    "linkedinbot", "facebookexternalhit", "facebot",
    "twitterbot", "whatsapp", "telegrambot", "slackbot",
    "googlebot", "bingbot", "applebot", "discordbot",
    "embedly", "skypeuripreview", "pinterest",
  ];
  return bots.some((bot) => ua.toLowerCase().includes(bot));
};

// ─── Log bot visits ───────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const ua = req.headers["user-agent"] || "";
  if (isSocialBot(ua)) {
    console.log(`[BOT] ${ua.substring(0, 80)} -> ${req.url}`);
  }
  next();
});

// ─── Debug route ──────────────────────────────────────────────────────────────
// Visit https://korsimnaturals.com/__test_seo to verify server is working
app.get("/__test_seo", (req, res) => {
  res.send(`
    <h1>SEO Server Active</h1>
    <p>API: ${API_BASE_URL}</p>
    <p>Time: ${new Date().toISOString()}</p>
    <hr/>
    <h2>Test OG tags with this command:</h2>
    <pre>curl -A "facebookexternalhit/1.1" https://korsimnaturals.com/punjab/agriculture/pak-soldiers-cryed-narrated-pain-bla-captivity-said-shehbaz-government-army-chief-578084410773</pre>
  `);
});

// ─── OG Meta Tag Injection ────────────────────────────────────────────────────
// Matches: /:category/:subcategory/:slugId
// Example: /punjab/agriculture/some-article-title-578084410773
app.get("/:category/:subcategory/:slugId", async (req, res, next) => {
  const { slugId } = req.params;

  // Skip static files (.js .css .png etc)
  if (slugId.includes(".")) return next();

  const indexPath = path.join(__dirname, "dist", "index.html");

  if (!fs.existsSync(indexPath)) {
    console.error("[SEO-ERROR]: dist/index.html not found!");
    return next();
  }

  const decodedSlugId = decodeURIComponent(slugId);

  // ✅ KEY FIX 1: Extract publicId from end of slug
  // Your article URLs end with the numeric publicId:
  // "pak-soldiers-cryed-...-578084410773" → publicId = "578084410773"
  const publicIdMatch = decodedSlugId.match(/(\d+)$/);
  const publicId      = publicIdMatch ? publicIdMatch[1] : null;

  if (!publicId) {
    console.warn("[SEO-WARN]: No publicId in slug:", decodedSlugId);
    return next();
  }

  // ✅ KEY FIX 2: Use publicId-based API endpoint
  const apiUri = `${API_BASE_URL}/articles/public/${publicId}`;

  console.log(`[SEO-INJECT]: publicId=${publicId} -> ${apiUri}`);

  const options = {
    agent:   new https.Agent({ rejectUnauthorized: false }),
    timeout: 5000,
  };

  const fallback = () => res.sendFile(indexPath);

  const request = https.get(apiUri, options, (apiRes) => {
    let body = "";
    apiRes.on("data", (chunk) => (body += chunk));
    apiRes.on("end", () => {

      if (apiRes.statusCode !== 200) {
        console.error(`[SEO-ERROR]: API HTTP ${apiRes.statusCode} for ${apiUri}`);
        return fallback();
      }

      try {
        const rawData = JSON.parse(body);

        // ✅ KEY FIX 3: Your API returns article at root level
        // { "_id":"...", "title":"...", "featuredImage":"https://res.cloudinary.com/..." }
        const article = rawData.data || rawData.article || rawData;

        // Debug logs — check your server terminal to verify
        console.log("[API]: title         =", article.title);
        console.log("[API]: featuredImage =", article.featuredImage);
        console.log("[API]: imageUrl      =", article.imageUrl);

        const pageTitle = `${article.title || "News Article"} | Korsim Naturals`;
        const pageDesc  = (
          article.summary       ||
          article.description   ||
          "Read the latest news on Korsim Naturals"
        ).substring(0, 160);

        const canonical = `${SITE_URL}${req.path}`;

        // ✅ KEY FIX 4: featuredImage is the correct field from your API
        // Your API response: "featuredImage":"https://res.cloudinary.com/dbouzdsoh/..."
        const img = toAbsoluteUrl(
          article.featuredImage ||
          article.imageUrl      ||
          article.image         ||
          article.coverImage    ||
          article.thumbnail     ||
          ""
        );

        console.log(`[SEO-IMAGE]:   ${img}`);
        console.log(`[SEO-SUCCESS]: "${pageTitle}"`);

        const tags = `
  <!-- SEO: Dynamic Meta Tags -->
  <title>${esc(pageTitle)}</title>
  <meta name="description"             content="${esc(pageDesc)}" />
  <link rel="canonical"                href="${canonical}" />

  <meta property="og:type"             content="article" />
  <meta property="og:site_name"        content="Korsim Naturals" />
  <meta property="og:title"            content="${esc(pageTitle)}" />
  <meta property="og:description"      content="${esc(pageDesc)}" />
  <meta property="og:url"              content="${canonical}" />
  <meta property="og:image"            content="${img}" />
  <meta property="og:image:secure_url" content="${img}" />
  <meta property="og:image:width"      content="1200" />
  <meta property="og:image:height"     content="630" />
  <meta property="og:image:alt"        content="${esc(article.title || "")}" />

  <meta name="twitter:card"            content="summary_large_image" />
  <meta name="twitter:title"           content="${esc(pageTitle)}" />
  <meta name="twitter:description"     content="${esc(pageDesc)}" />
  <meta name="twitter:image"           content="${img}" />
  <meta name="twitter:url"             content="${canonical}" />
  <!-- SEO: End Dynamic Meta Tags -->
`;

        let html = fs.readFileSync(indexPath, "utf8");
        html = html.replace(/<title>.*?<\/title>/is, "");
        html = html.replace("<head>", `<head>\n${tags}`);

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.send(html);

      } catch (parseErr) {
        console.error("[SEO-ERROR]: JSON parse failed:", parseErr.message);
        return fallback();
      }
    });
  });

  request.on("timeout", () => {
    console.error("[SEO-ERROR]: API timed out");
    request.destroy();
    return fallback();
  });

  request.on("error", (e) => {
    console.error("[SEO-ERROR]: API connection failed:", e.message);
    return fallback();
  });
});

// ─── Static files ─────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "dist")));

// ─── SPA catch-all ────────────────────────────────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Site:     ${SITE_URL}`);
  console.log(`API:      ${API_BASE_URL}`);
  console.log(`Test SEO: ${SITE_URL}/__test_seo`);
});