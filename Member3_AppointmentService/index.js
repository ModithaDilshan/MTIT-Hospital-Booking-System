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
            title: 'Appointment Service API (Member 3)',
            version: '1.0.0',
            description: 'Microservice handling doctor-patient schedules',
        },
        servers: [ { url: `http://localhost:${process.env.PORT}` } ]
    },
    apis: ['./routes/*.js']
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connect to DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Appointment Service: MongoDB Connected to appointment_db'))
    .catch(err => console.log('❌ Appointment DB Error: ', err.message));

// Routes
const aptRoutes = require('./routes/appointmentRoutes');
app.use('/api', aptRoutes);

const PORT = process.env.PORT || 8003;
app.listen(PORT, () => {
    console.log(`📅 Member 3 - Appointment Service running on internal port ${PORT}`);
    console.log(`📑 Appointment Docs: http://localhost:${PORT}/api-docs`);
});
