const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/payments', require('./routes/paymentRoutes'));

app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'payment-service' });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Payment service running on port ${PORT}`);
});