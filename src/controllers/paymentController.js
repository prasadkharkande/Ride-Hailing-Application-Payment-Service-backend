const db = require('../config/db');
const axios = require('axios');

async function getAllPayments(req, res) {
    try {
        const qry = 'SELECT * FROM rhfd_payments';
        const [payments] = await db.query(qry);
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getPaymentById(req, res) {
    try {
        const qry = 'SELECT * FROM rhfd_payments WHERE payment_id = ?';
        const [payment] = await db.query(qry, [req.params.id]);
        if (payment.length === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json(payment[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getPaymentsByTrip(req, res) {
    try {
        const qry = 'SELECT * FROM rhfd_payments WHERE trip_id = ?';
        const [payments] = await db.query(qry, [req.params.tripId]);
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createPayment(req, res) {
    try {
        const { trip_id, amount, method } = req.body;

        // verify trip exists in trip service
        try {
            await axios.get(`${process.env.TRIP_SERVICE_URL}/api/trips/${trip_id}`);
        } catch (err) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        const reference = generatePaymentReference();

        const qry = 'INSERT INTO rhfd_payments (trip_id, amount, method, reference) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(qry, [trip_id, amount, method, reference]);

        const qry2 = 'SELECT * FROM rhfd_payments WHERE payment_id = ?';
        const [payment] = await db.query(qry2, [result.insertId]);

        res.status(201).json(payment[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updatePaymentStatus(req, res) {
    try {
        const { status } = req.body;
        const validStatuses = ['PENDING', 'SUCCESS', 'FAILED'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const qry = 'UPDATE rhfd_payments SET status = ? WHERE payment_id = ?';
        await db.query(qry, [status, req.params.id]);

        res.json({ message: 'Payment status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function generatePaymentReference() {
    const prefix = 'RHP';
    const timestamp = new Date().getFullYear().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${timestamp}-${random}`;
}

module.exports = {
    getAllPayments,
    getPaymentById,
    getPaymentsByTrip,
    createPayment,
    updatePaymentStatus
};