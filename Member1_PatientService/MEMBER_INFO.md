# Member 1 Contribution: Patient Service
**Port:** 8001
**Database Name:** patient_db

## Responsibilities
- Architected and implemented the `Patient Service` Node.js application.
- Created MongoDB `Patient` schemas for managing patient demographics (Name, Age, Blood Group, Contact).
- Integrated Express.js Routing for the following operations:
   - `POST /api/patients` (Register Patient)
   - `GET /api/patients` (Retrieve all patients)
   - `GET /api/patients/:id` (Retrieve single patient record)
   - `PUT /api/patients/:id` (Update patient details)
   - `DELETE /api/patients/:id` (Remove patient record)
- Authored automated Swagger UI documentation (`/api-docs`).

## Usage
Simply run `node index.js`. This microservice operates independently on Port `8001`, handling all incoming REST commands.
