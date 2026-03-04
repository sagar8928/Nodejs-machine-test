const db = require('../config/db.js');

// GET all 
exports.getAllProducts = async (req, res) => {
    try {
        // Get page and pageSize from query parameters
        
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        
        const offset = (page - 1) * pageSize;
        
        const [countResult] = await db.query(`
            SELECT COUNT(*) as total 
            FROM Products p 
            JOIN Categories c ON p.CategoryId = c.CategoryId
        `);
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / pageSize);
        
        // LIMIT = pageSize, OFFSET = starting position
        const [rows] = await db.query(`
            SELECT 
                p.ProductId,
                p.ProductName,
                p.CategoryId,
                c.CategoryName
            FROM Products p
            JOIN Categories c ON p.CategoryId = c.CategoryId
            ORDER BY p.ProductId DESC
            LIMIT ? OFFSET ?
        `, [pageSize, offset]);
        
        res.json({
            success: true,
            data: rows,
            pagination: {
                currentPage: page,
                pageSize: pageSize,
                totalRecords: totalRecords,
                totalPages: totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                p.ProductId,
                p.ProductName,
                p.CategoryId,
                c.CategoryName
            FROM Products p
            JOIN Categories c ON p.CategoryId = c.CategoryId
            WHERE p.ProductId = ?
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { ProductName, CategoryId } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO Products (ProductName, CategoryId) VALUES (?, ?)',
            [ProductName, CategoryId]
        );
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: {
                ProductId: result.insertId,
                ProductName: ProductName,
                CategoryId: CategoryId
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { ProductName, CategoryId } = req.body;
        const productId = req.params.id;
        
        const [result] = await db.query(
            'UPDATE Products SET ProductName = ?, CategoryId = ? WHERE ProductId = ?',
            [ProductName, CategoryId, productId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Product updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM Products WHERE ProductId = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};