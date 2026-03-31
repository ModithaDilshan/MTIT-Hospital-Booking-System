const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

/**
 * @swagger
 * tags:
 *   name: Billing
 *   description: Financial records and invoicing
 */

/**
 * @swagger
 * /api/bills:
 *   get:
 *     summary: Obtain all hospital bills
 *     tags: [Billing]
 *     responses:
 *       200:
 *         description: Array of billing records
 */
router.get('/bills', async (req, res) => {
    try {
        const bills = await Bill.find();
        res.status(200).json({ success: true, count: bills.length, data: bills });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/bills:
 *   post:
 *     summary: Create new patient bill
 *     tags: [Billing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, patientName, description, amount, paymentType]
 *             properties:
 *               patientId: { type: string }
 *               patientName: { type: string }
 *               description: { type: string }
 *               amount: { type: number }
 *               paymentType: { type: string }
 *               status: { type: string }
 *     responses:
 *       201:
 *         description: Bill successfully formulated
 */
router.post('/bills', async (req, res) => {
    try {
        const bill = await Bill.create(req.body);
        res.status(201).json({ success: true, data: bill });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/bills/{id}:
 *   put:
 *     summary: Mark bill as paid or refunded
 *     tags: [Billing]
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
 *         description: Updated transaction
 */
router.put('/bills/:id', async (req, res) => {
    try {
        const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if(!bill) return res.status(404).json({ success: false, error: "Not found" });
        res.status(200).json({ success: true, data: bill });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/bills/{id}:
 *   delete:
 *     summary: Void/Delete a transaction
 *     tags: [Billing]
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
router.delete('/bills/:id', async (req, res) => {
    try {
        const bill = await Bill.findByIdAndDelete(req.params.id);
        if(!bill) return res.status(404).json({ success: false, error: "Not found" });
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
