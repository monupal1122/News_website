import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import prerender from 'prerender-node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// PRERENDER.IO CONFIGURATION
prerender.set('prerenderToken', process.env.PRERENDER_TOKEN || 'MKc29XdWcppSm65HX6n4');
prerender.set('host', 'korsimnaturals.com');
prerender.set('debug', true);

// Explicitly add common crawlers
const socialBots = [
    'LinkedInBot',
    'facebookexternalhit',
    'Facebot',
    'Twitterbot',
    'WhatsApp',
    'TelegramBot',
    'Slackbot'
];

prerender.shouldShowPrerender = function (req) {
    const userAgent = req.headers['user-agent'] || '';
    const isBot = socialBots.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()));

    if (isBot) {
        console.log(`[SOCIAL BOT DETECTED]: ${userAgent} requesting ${req.url}`);
    }
    return isBot;
};

app.use(prerender);

console.log('--- FRONTEND SERVER BOOTING ---');
console.log(`Prerender Token: ${process.env.PRERENDER_TOKEN ? 'Loaded from Env' : 'Using Hardcoded Fallback'}`);
console.log('--------------------------------');


// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all routes by serving index.html (SPA routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend server running on port ${PORT}`);
});
