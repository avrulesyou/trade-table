// server.js
const express = require('express');
const next = require('next');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Add CORS middleware
  server.use(cors());

  server.get('*', (req, res) => {
    return handle(req, res);
  });
  server.use(cors({
    origin: 'http://173.249.49.52:18080/positionget'
  }));

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});