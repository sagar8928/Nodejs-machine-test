const db = require('../config/db.js');

// GET all categories
exports.getAllCategories = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Categories ORDER BY CategoryId DESC');
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};

// GET single category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM Categories WHERE CategoryId = ?', 
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching category',
            error: error.message
        });
    }
};

// CREATE new category
exports.createCategory = async (req, res) => {
    try {
        const { CategoryName } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO Categories (CategoryName) VALUES (?)',
            [CategoryName]
        );
        
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: {
                CategoryId: result.insertId,
                CategoryName: CategoryName
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating category',
            error: error.message
        });
    }
};

// UPDATE category
exports.updateCategory = async (req, res) => {
    try {
        const { CategoryName } = req.body;
        const categoryId = req.params.id;
        
        const [result] = await db.query(
            'UPDATE Categories SET CategoryName = ? WHERE CategoryId = ?',
            [CategoryName, categoryId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Category updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating category',
            error: error.message
        });
    }
};

// DELETE category
exports.deleteCategory = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM Categories WHERE CategoryId = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting category',
            error: error.message
        });
    }
};