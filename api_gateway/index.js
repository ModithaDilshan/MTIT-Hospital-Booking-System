const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());

// Define Microservice routes (with hardcoded local fallbacks if .env is missing)
const services = {
    '/api/patients': process.env.PATIENT_SERVICE_URL || 'http://localhost:8001',
    '/api/doctors': process.env.DOCTOR_SERVICE_URL || 'http://localhost:8002',
    '/api/appointments': process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:8003',
    '/api/bills': process.env.BILLING_SERVICE_URL || 'http://localhost:8004'
};

// Setup reverse proxies dynamically
for (const [route, target] of Object.entries(services)) {
    if (target) {
        app.use(route, createProxyMiddleware({
            target,
            changeOrigin: true,
            onError: (err, req, res) => {
                console.error(`Proxy Error on ${route}:`, err.message);
                res.status(502).json({ error: 'Service Unavailable', message: `Target microservice at ${target} is unreachable.` });
            }
        }));
    }
}

app.get('/', (req, res) => {
    res.json({
        service: 'Grand City Hospital API Gateway',
        status: 'Active',
        endpoints: Object.keys(services)
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`🚀 Grand City Hospital API GATEWAY running`);
    console.log(`🌐 Accessible on http://localhost:${PORT}`);
    console.log(`===========================================`);
});
