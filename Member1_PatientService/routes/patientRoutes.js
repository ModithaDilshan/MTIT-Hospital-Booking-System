const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient management endpoints
 */

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Returns all registered patients
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: Array of patients
 */
router.get('/patients', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json({ success: true, count: patients.length, data: patients });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Register a new patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, age, gender, contact, bloodGroup, address]
 *             properties:
 *               name: { type: string }
 *               age: { type: number }
 *               gender: { type: string }
 *               contact: { type: string }
 *               bloodGroup: { type: string }
 *               address: { type: string }
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Validation payload error
 */
router.post('/patients', async (req, res) => {
    try {
        const patient = await Patient.create(req.body);
        res.status(201).json({ success: true, data: patient });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Update existing patient data
 *     tags: [Patients]
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
 *         description: Result of the update
 */
router.put('/patients/:id', async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if(!patient) return res.status(404).json({ success: false, error: "Patient not found" });
        res.status(200).json({ success: true, data: patient });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     summary: Delete a patient record
 *     tags: [Patients]
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
router.delete('/patients/:id', async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if(!patient) return res.status(404).json({ success: false, error: "Patient not found" });
        res.status(200).json({ success: true, message: "Patient deleted" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
