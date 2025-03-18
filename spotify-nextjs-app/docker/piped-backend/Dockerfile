FROM node:18-alpine

WORKDIR /app

# Create package.json with required dependencies
COPY <<-'EOF' /app/package.json
{
  "name": "piped-backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "node-fetch": "^2.6.9"
  }
}
EOF

# Add the backend server code
COPY <<-'EOF' /app/index.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

const port = process.env.PORT || 8081;

app.get('/streams/:videoId', async (req, res) => {
  try {
    const response = await fetch(`https://pipedapi.kavin.rocks/streams/${req.params.videoId}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch stream data' });
  }
});

app.get('/search', async (req, res) => {
  try {
    const response = await fetch(`https://pipedapi.kavin.rocks/search?q=${req.query.q}&filter=music`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
});

app.listen(port, () => {
  console.log(`Piped backend running on port ${port}`);
});
EOF

# Install dependencies
RUN npm install

EXPOSE 8081

ENV PORT=8081

CMD ["npm", "start"]