const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

app.use('/api', 
createProxyMiddleware({
  target: 'https://spcrc.iiit.ac.in/water/staticnodesC',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/staticnodesC', // Rewrite /api to /test
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('origin', 'http://localhost:5173'); // Set the origin header to https://abc.com
  },
}));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
