import express from 'express';
import FixerApi from '../services/FixerApi.js';
import RatesService from '../services/RatesService.js';
import dotenv from 'dotenv';

dotenv.config();

const fixerApi = new FixerApi(process.env.FIXER_API_KEY);
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const ratesService = new RatesService(fixerApi, CACHE_DURATION);

const router = express.Router();

/**
 * @swagger
 * /rates:
 *   get:
 *     summary: Get exchange rates
 *     description: Retrieve exchange rates for a given base currency.
 *     parameters:
 *       - in: query
 *         name: base
 *         schema:
 *           type: string
 *         description: The base currency (default is EUR)
 *     responses:
 *       200:
 *         description: A list of exchange rates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rates:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *       500:
 *         description: Error fetching rates
 */
router.get('/rates', async (req, res) => {
    try {
        const baseCurrency = req.query.base || 'EUR';
        const rates = await ratesService.getRates(baseCurrency);
        res.json(rates);
    } catch (error) {
        console.error('Error fetching rates:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /convert:
 *   get:
 *     summary: Convert currency
 *     description: Convert an amount from one currency to another.
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *         description: The source currency (default is EUR)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         description: The target currency (default is USD)
 *       - in: query
 *         name: amount
 *         schema:
 *           type: number
 *         description: The amount to convert (default is 1)
 *     responses:
 *       200:
 *         description: The converted amount
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: string
 *                 to:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 convertedAmount:
 *                   type: number
 *       500:
 *         description: Error converting currency
 */
router.get('/convert', async (req, res) => {
    try {
        const fromCurrency = req.query.from || 'EUR';
        const toCurrency = req.query.to || 'USD';
        const amount = parseFloat(req.query.amount) || 0;
        const convertedAmount = await ratesService.convertCurrency(fromCurrency, toCurrency, amount);
        res.json({ from: fromCurrency, to: toCurrency, amount, convertedAmount });
    } catch (error) {
        console.error('Error converting currency:', error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;