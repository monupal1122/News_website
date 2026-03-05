import express from "express";
import fs from "fs";
import path from "path";
import axios from "axios";

const app = express();
const PORT = 3000;

const SITE_URL = "https://korsimnaturals.com";
const API_URL = "https://admin.korsimnaturals.com/api";

const isBot = (ua) => {
  const bots = [
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "whatsapp",
    "telegrambot"
  ];

  return bots.some((bot) => ua.toLowerCase().includes(bot));
};

app.get("/:category/:subcategory/:slugId", async (req, res, next) => {

  const ua = req.headers["user-agent"] || "";

  if (!isBot(ua)) return next();

  const { category, subcategory, slugId } = req.params;

  try {

    const apiUrl = `${API_URL}/articles/${category}/${subcategory}/${slugId}`;

    const response = await axios.get(apiUrl);
console.log("response",response);

    const article = response.data.data;
console.log(article);

    const title = article.title;
    const description = article.summary;
    // const image = article.featuredImage;

    const indexPath = path.join(process.cwd(), "dist/index.html");

    let html = fs.readFileSync(indexPath, "utf8");

    const metaTags = `
      <title>${title}</title>

      <meta name="description" content="${description}" />

      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${featuredImage}" />
      <meta property="og:url" content="${SITE_URL}${req.url}" />
      <meta property="og:type" content="article" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${image}" />
    `;

    html = html.replace("<head>", `<head>${metaTags}`);

    res.send(html);

  } catch (err) {

    console.log(err);

    next();
  }
});

app.use(express.static("dist"));

app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist/index.html"));
});

app.listen(PORT, () => {
  console.log("SEO Server running on port", PORT);
});