import express from "express";
import path from "path";
import fs from "fs";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const SITE_URL = "https://korsimnaturals.com";
const API_BASE = "https://admin.korsimnaturals.com/api";

// ===== BOT DETECTION =====
const isBot = (ua = "") => {
  const bots = [
    "linkedinbot",
    "facebookexternalhit",
    "facebot",
    "twitterbot",
    "whatsapp",
    "telegrambot",
    "slackbot"
  ];
  return bots.some(bot => ua.toLowerCase().includes(bot));
};

// ===== HTML ESCAPE =====
const esc = (str = "") =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// ===== IMAGE HANDLER =====
const getImageUrl = (img) => {
  if (!img) return `${SITE_URL}/default.png`;

  if (img.startsWith("http")) return img;

  if (img.includes("cloudinary.com")) return img;

  return `https://admin.korsimnaturals.com/${img}`;
};

// ===== ARTICLE ROUTE SEO INJECTION =====
app.get("/:category/:subcategory/:slug", async (req, res, next) => {
  const ua = req.headers["user-agent"] || "";

  if (!isBot(ua)) return next();

  const { category, subcategory, slug } = req.params;

  try {
    const apiUrl = `${API_BASE}/articles/${category}/${subcategory}/${slug}`;

    https.get(apiUrl, (apiRes) => {
      let data = "";

      apiRes.on("data", chunk => (data += chunk));

      apiRes.on("end", () => {
        if (apiRes.statusCode !== 200) {
          return res.sendFile(path.join(__dirname, "dist", "index.html"));
        }

        const json = JSON.parse(data);
        const article = json.data || json.article || json;

        const title = esc(article.title || "News Article");
        const desc = esc(
          (article.summary || article.description || "")
            .substring(0, 160)
        );
        const image = getImageUrl(
          article.featuredImage || article.imageUrl
        );

        const url = `${SITE_URL}${req.originalUrl}`;

        const metaTags = `
        <title>${title}</title>
        <meta name="description" content="${desc}" />
        <link rel="canonical" href="${url}" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${desc}" />
        <meta property="og:image" content="${image}" />
        <meta property="og:url" content="${url}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${desc}" />
        <meta name="twitter:image" content="${image}" />
        `;

        let html = fs.readFileSync(
          path.join(__dirname, "dist", "index.html"),
          "utf8"
        );

        html = html.replace(/<title>.*?<\/title>/i, "");
        html = html.replace("<head>", `<head>${metaTags}`);

        return res.send(html);
      });
    }).on("error", () => {
      return res.sendFile(path.join(__dirname, "dist", "index.html"));
    });

  } catch (err) {
    return res.sendFile(path.join(__dirname, "dist", "index.html"));
  }
});

// ===== STATIC FILES =====
app.use(express.static(path.join(__dirname, "dist")));

// ===== SPA FALLBACK =====
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SEO Server running on port ${PORT}`);
});