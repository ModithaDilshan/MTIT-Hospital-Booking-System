const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Swagger Setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Billing Service API (Member 4)',
            version: '1.0.0',
            description: 'Microservice handling hospital financial records',
        },
        servers: [ { url: `http://localhost:${process.env.PORT}` } ]
    },
    apis: ['./routes/*.js']
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connect to DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Billing Service: MongoDB Connected to billing_db'))
    .catch(err => console.log('❌ Billing DB Error: ', err.message));

// Routes
const billingRoutes = require('./routes/billingRoutes');
app.use('/api', billingRoutes);

const PORT = process.env.PORT || 8004;
app.listen(PORT, () => {
    console.log(`💳 Member 4 - Billing Service running on internal port ${PORT}`);
    console.log(`📑 Billing Docs: http://localhost:${PORT}/api-docs`);
});
