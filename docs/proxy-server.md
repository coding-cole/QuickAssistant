# Proxy Server (Development CORS Helper)

This project includes a simple development-only proxy server to bypass CORS restrictions when calling third‑party APIs from the app.

## What it does

- Accepts incoming requests at `http://localhost:3001`
- Forwards the request to a target URL you provide
- Adds permissive CORS headers to the response

> ✅ **Development only**: Do not use this proxy in production. It has no authentication or rate limiting.

## Start the server

From the repository root:

```bash
node proxy-server.js
```

You should see:

```
[Proxy] CORS proxy server running at http://localhost:3001
[Proxy] Usage: http://localhost:3001?url=<encoded-target-url>
```

## Make requests

Provide the target URL using the `url` query parameter (URL-encoded).

### Example: GET

```
http://localhost:3001?url=https%3A%2F%2Fjsonplaceholder.typicode.com%2Ftodos%2F1
```

### Example: POST

Send the request body as usual from your client. The proxy will forward it.

```ts
fetch('http://localhost:3001?url=' + encodeURIComponent('https://example.com/api/submit'), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'hello' }),
});
```

## Troubleshooting

- **Missing `url` parameter**: The proxy returns `400` with an error message.
- **URL not encoded**: Always wrap the target with `encodeURIComponent(...)`.
- **HTTPS target**: Works automatically—no config required.
- **Port in use**: Change `PORT` in `proxy-server.js` if `3001` is already taken.

## Notes

The proxy removes some request headers that often trigger CORS issues (`origin`, `referer`, etc.) before forwarding to the target.
