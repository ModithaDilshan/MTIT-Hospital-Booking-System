# Member 3 Contribution: Appointment Service
**Port:** 8003
**Database Name:** appointment_db

## Responsibilities
- Engineered the `Appointment Service` to link Patients with Doctors.
- Drafted the `Appointment` MongoDB structure to hold scheduling data and statuses.
- Built comprehensive endpoints for scheduling logic:
   - `GET /api/appointments` (Read all structured schedules)
   - `POST /api/appointments` (Book an appointment slot)
   - `PUT /api/appointments/:id` (Update date, time, or status)
   - `DELETE /api/appointments/:id` (Cancel/Drop a slot)
- Developed robust API interactive documentation using Swagger UI.

## Usage
Simply run `node index.js`. This microservice operates independently on Port `8003`.
