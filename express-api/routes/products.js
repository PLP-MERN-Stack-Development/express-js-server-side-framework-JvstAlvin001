const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
let products = [];

// Get all products with filtering and pagination
router.get('/', (req, res) => {
  let result = [...products];
  const { category, search, page = 1, limit = 5 } = req.query;

  if (category) result = result.filter(p => p.category === category);
  if (search) {
    const searchLower = search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(searchLower));
  }

  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  const paginated = result.slice(start, end);

  res.json({
    total: result.length,
    page: parseInt(page),
    limit: parseInt(limit),
    data: paginated,
  });
});


// Get product by ID
router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    res.json(product);
    }
});

//POST create new product
router.post('/', (req, res) => {
    const { name, description, price, category } = req.body;
if (!name || !description || !price || !category) return res.status(400).json({ message: 'All fields are required' });

    const newProduct = { id: uuidv4(), name, description, price, category };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

//PUT update product by ID
router.put('/:id', (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
});

//DELETE product by ID
router.delete('/:id', (req, res) => {
    products = products.filter(p => p.id !== req.params.id);
    res.json({ message: 'Product deleted' });
});

//Stats route
router.get('/stats/summary', (req, res) => {
    const summary = {};
products.forEach(p => {
    summary[p.category] = (summary[p.category] || 0) + 1;
});
res.json(summary);
});

// 🔍 Search products by name
router.get('/search', (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: 'Please provide a name to search.' });
  }
  const searchLower = name.toLowerCase();
  const results = products.filter(p => p.name.toLowerCase().includes(searchLower));
  res.json({ count: results.length, results });
});

// 📊 Get product statistics by category
router.get('/stats', (req, res) => {
  const stats = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  res.json(stats);
});


module.exports = router;
