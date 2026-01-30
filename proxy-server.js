/**
 * Simple CORS Proxy Server for Development
 *
 * Run with: node proxy-server.js
 * The proxy will be available at http://localhost:3001
 */

const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3001;

// Headers to remove from client request (these can cause CORS issues)
const HEADERS_TO_REMOVE = [
  'host',
  'origin',
  'referer',
  'sec-fetch-mode',
  'sec-fetch-site',
  'sec-fetch-dest',
];

const server = http.createServer((req, res) => {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Get the target URL from query parameter
  const parsedUrl = url.parse(req.url, true);
  const targetUrl = parsedUrl.query.url;

  if (!targetUrl) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing "url" query parameter' }));
    return;
  }

  console.log(`[Proxy] ${req.method} -> ${targetUrl}`);

  // Parse the target URL
  const target = url.parse(targetUrl);
  const isHttps = target.protocol === 'https:';
  const httpModule = isHttps ? https : http;

  // Collect request body
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    // Forward headers but remove problematic ones
    const headers = {};
    for (const [key, value] of Object.entries(req.headers)) {
      const lowerKey = key.toLowerCase();
      if (!HEADERS_TO_REMOVE.includes(lowerKey)) {
        headers[key] = value;
      }
    }

    // Set the correct host header for the target
    headers['host'] = target.host;

    // Remove any origin-related headers that might trigger CORS
    delete headers['origin'];
    delete headers['referer'];

    console.log(`[Proxy] Forwarding headers:`, Object.keys(headers));

    const options = {
      hostname: target.hostname,
      port: target.port || (isHttps ? 443 : 80),
      path: target.path,
      method: req.method,
      headers: headers,
    };

    const proxyReq = httpModule.request(options, (proxyRes) => {
      console.log(`[Proxy] Response: ${proxyRes.statusCode}`);

      // Add CORS headers to response
      const responseHeaders = { ...proxyRes.headers };
      responseHeaders['access-control-allow-origin'] = '*';
      responseHeaders['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      responseHeaders['access-control-allow-headers'] = '*';

      // Forward response
      res.writeHead(proxyRes.statusCode, responseHeaders);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error(`[Proxy] Error: ${err.message}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    });

    // Send body if present
    if (body) {
      proxyReq.write(body);
    }

    proxyReq.end();
  });
});

server.listen(PORT, () => {
  console.log(`[Proxy] CORS proxy server running at http://localhost:${PORT}`);
  console.log(`[Proxy] Usage: http://localhost:${PORT}?url=<encoded-target-url>`);
});
