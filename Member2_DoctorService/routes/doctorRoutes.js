const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Physician management endpoints
 */

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Returns all hospital doctors
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: Array of doctors
 */
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json({ success: true, count: doctors.length, data: doctors });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/doctors:
 *   post:
 *     summary: Hire/register new doctor
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, specialization, experienceYears, consultationFee]
 *             properties:
 *               name: { type: string }
 *               specialization: { type: string }
 *               experienceYears: { type: number }
 *               consultationFee: { type: number }
 *               availability: { type: string }
 *     responses:
 *       201:
 *         description: Doctor profile created
 */
router.post('/doctors', async (req, res) => {
    try {
        const doctor = await Doctor.create(req.body);
        res.status(201).json({ success: true, data: doctor });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/doctors/{id}:
 *   put:
 *     summary: Update doctor info or availability
 *     tags: [Doctors]
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
 *         description: Record updated successfully
 */
router.put('/doctors/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if(!doctor) return res.status(404).json({ success: false, error: "Not found" });
        res.status(200).json({ success: true, data: doctor });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/doctors/{id}:
 *   delete:
 *     summary: Fire/delete a doctor
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.delete('/doctors/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if(!doctor) return res.status(404).json({ success: false, error: "Not found" });
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
