FROM node:18-alpine

WORKDIR /app

# Create data directory in the container
RUN mkdir -p /app/data && \
    chown -R node:node /app

USER node

# Create package.json with required dependencies
COPY <<-'EOF' /app/package.json
{
  "name": "piped-proxy",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "http-proxy-middleware": "^2.0.6"
  }
}
EOF

# Add the proxy server code
COPY <<-'EOF' /app/index.js
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

const port = process.env.PORT || 8080;

app.use('/proxy', createProxyMiddleware({
  target: 'https://pipedapi.kavin.rocks',
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': ''
  }
}));

app.listen(port, () => {
  console.log(`Piped proxy running on port ${port}`);
});
EOF

# Install dependencies before running
RUN npm install

EXPOSE 8080

ENV PORT=8080
ENV PROXY_PART=proxy

# Use environment variable for data directory
ENV DATA_DIR=/app/data

CMD ["npm", "start"]