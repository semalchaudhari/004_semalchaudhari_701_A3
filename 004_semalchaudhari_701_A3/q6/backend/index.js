import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/currency', async (req, res) => {
    try {
        const { from, to, amount } = req.query;

        const response = await axios.get(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`
        );

        res.json(response.data);

    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch currency data'
        });
    }
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});