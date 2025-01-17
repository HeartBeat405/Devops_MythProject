const express = require('express');
const path = require('path');
const client = require('prom-client');
const app = express();

// Create a Registry to register metrics
const register = new client.Registry();

// Create metrics
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status']
});

// Register metrics
register.registerMetric(httpRequestsTotal);

// Middleware to count requests
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestsTotal.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
});

// Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Menyajikan file index.html dari root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Menyajikan file statis lainnya, jika ada (misalnya CSS, JS)
app.use(express.static(path.join(__dirname)));

// Menjalankan server di port 5000
app.listen(5000, () => {
  console.log('Server berjalan di port 5000');
});
