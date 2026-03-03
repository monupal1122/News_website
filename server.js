import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import prerender from 'prerender-node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// PRERENDER.IO - Must be FIRST to intercept bots
prerender.set('prerenderToken', process.env.PRERENDER_TOKEN || 'MKc29XdWcppSm65HX6n4');
prerender.set('host', 'korsimnaturals.com');
prerender.set('debug', true); // Now enabled: Look for "Prerender" in your logs!

// Ensure LinkedIn is explicitly covered
prerender.crawlerUserAgents.push('LinkedInBot');
prerender.crawlerUserAgents.push('Facebot');

app.use(prerender);

console.log('--- FRONTEND SERVER ---');
console.log(`Prerender Token: ${process.env.PRERENDER_TOKEN ? 'Configured' : 'Using default'}`);
console.log('------------------------');


// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all routes by serving index.html (SPA routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend server running on port ${PORT}`);
});
