const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment scheduling endpoints
 */

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Returns all active appointments
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Array of appointments
 */
router.get('/appointments', async (req, res) => {
    try {
        const apts = await Appointment.find();
        res.status(200).json({ success: true, count: apts.length, data: apts });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Schedule a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, patientName, doctorId, doctorName, appointmentDate, timeSlot]
 *             properties:
 *               patientId: { type: string }
 *               patientName: { type: string }
 *               doctorId: { type: string }
 *               doctorName: { type: string }
 *               appointmentDate: { type: string, format: date }
 *               timeSlot: { type: string }
 *               status: { type: string }
 *     responses:
 *       201:
 *         description: Appointment structured successfully
 */
router.post('/appointments', async (req, res) => {
    try {
        const apt = await Appointment.create(req.body);
        res.status(201).json({ success: true, data: apt });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Reschedule or status update
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated appointment
 */
router.put('/appointments/:id', async (req, res) => {
    try {
        const apt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if(!apt) return res.status(404).json({ success: false, error: "Not found" });
        res.status(200).json({ success: true, data: apt });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     summary: Delete appointment securely
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment deleted
 */
router.delete('/appointments/:id', async (req, res) => {
    try {
        const apt = await Appointment.findByIdAndDelete(req.params.id);
        if(!apt) return res.status(404).json({ success: false, error: "Not found" });
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
