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
            title: 'Patient Service API (Member 1)',
            version: '1.0.0',
            description: 'Microservice handling hospital patients',
        },
        servers: [ { url: `http://localhost:${process.env.PORT}` } ]
    },
    apis: ['./routes/*.js']
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connect to DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Patient Service: MongoDB Connected to patient_db'))
    .catch(err => console.log('❌ Patient Service DB Error: ', err.message));

// Routes
const patientRoutes = require('./routes/patientRoutes');
app.use('/api', patientRoutes);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`🏥 Member 1 - Patient Service running on internal port ${PORT}`);
    console.log(`📑 Patient Docs: http://localhost:${PORT}/api-docs`);
});
