const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/', paymentController.getAllPayments);
router.get('/trip/:tripId', paymentController.getPaymentsByTrip);
router.get('/:id', paymentController.getPaymentById);
router.post('/', paymentController.createPayment);
router.patch('/:id/status', paymentController.updatePaymentStatus);

module.exports = router;