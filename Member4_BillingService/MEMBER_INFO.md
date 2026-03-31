# Member 4 Contribution: Billing Service
**Port:** 8004
**Database Name:** billing_db

## Responsibilities
- Structured and delivered the `Billing & Invoice Service`.
- Engineered MongoDB `Bill` collections mapped directly to patient expenses and consultation charges.
- Integrated financial endpoints via Express routing:
   - `GET /api/bills` (Retrieve comprehensive transaction history)
   - `POST /api/bills` (Generate a new invoice)
   - `PUT /api/bills/:id` (Acknowledge payment/update status)
   - `DELETE /api/bills/:id` (Void an invoice)
- Deployed complete Swagger integration for testing and documentation.

## Usage
Simply run `node index.js`. This microservice operates independently on Port `8004`.
