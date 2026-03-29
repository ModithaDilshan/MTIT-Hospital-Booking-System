# Member 2 Contribution: Doctor Service
**Port:** 8002
**Database Name:** doctor_db

## Responsibilities
- Architected and implemented the `Doctor Service` Node.js application.
- Created MongoDB `Doctor` models for tracking physicians (Specialization, Fees, Availability).
- Built high-performance Express.js REST endpoints:
   - `GET /api/doctors` (List doctors)
   - `POST /api/doctors` (Onboard physician)
   - `PUT /api/doctors/:id` (Update physician details/availability)
   - `DELETE /api/doctors/:id` (Remove physician)
- Provided full API documentation accessible at `/api-docs`.

## Usage
Simply run `node index.js`. This microservice operates independently on Port `8002`.
