const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = 3000;


app.use(cors()); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Product Management API' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API Endpoints:`);
    console.log(`  - Categories: http://localhost:${PORT}/api/categories`);
    console.log(`  - Products: http://localhost:${PORT}/api/products`);
});