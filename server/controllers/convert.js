const { convertCurrency } = require('../libs/currency');

async function currencyController(req, res) {
  try {
    const { from, to, amount } = req.query;
    const result = await convertCurrency(from, to, amount);

    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = { currencyController };
