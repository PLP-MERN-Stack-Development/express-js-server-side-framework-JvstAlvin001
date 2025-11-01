const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const productRoutes = require('./routes/products');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(logger);

// Authentication Middleware (global)
app.use(auth);

// Routes
app.use('/api/products', productRoutes);

//default route
app.get('/', (req, res) => {
    res.send('Welcome to the Express API!');
});

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});