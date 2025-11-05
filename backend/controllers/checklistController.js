const db = require('../config/database');

// Get all checklists for a user
const getAllChecklists = async (req, res) => {
    try {
        const userId = req.user?.id;
        let query = 'SELECT * FROM test_checklists';
        let params = [];
        
        if (userId) {
            query += ' WHERE user_id = ?';
            params.push(userId);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const [checklists] = await db.execute(query, params);
        res.json({ success: true, data: checklists });
    } catch (error) {
        console.error('Error fetching checklists:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch checklists', error: error.message });
    }
};

// Get a single checklist with its items
const getChecklistById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        
        let checklistQuery = 'SELECT * FROM test_checklists WHERE id = ?';
        let checklistParams = [id];
        
        if (userId) {
            checklistQuery += ' AND user_id = ?';
            checklistParams.push(userId);
        }
        
        const [checklists] = await db.execute(checklistQuery, checklistParams);
        
        if (checklists.length === 0) {
            return res.status(404).json({ success: false, message: 'Checklist not found' });
        }
        
        const [items] = await db.execute(
            'SELECT * FROM checklist_items WHERE checklist_id = ? ORDER BY order_index ASC',
            [id]
        );
        
        res.json({ 
            success: true, 
            data: { 
                ...checklists[0], 
                items 
            } 
        });
    } catch (error) {
        console.error('Error fetching checklist:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch checklist', error: error.message });
    }
};

// Create a new checklist
const createChecklist = async (req, res) => {
    try {
        const { name, description, items } = req.body;
        const userId = req.user?.id;
        
        if (!name) {
            return res.status(400).json({ success: false, message: 'Checklist name is required' });
        }
        
        const [result] = await db.execute(
            'INSERT INTO test_checklists (user_id, name, description) VALUES (?, ?, ?)',
            [userId, name, description || null]
        );
        
        const checklistId = result.insertId;
        
        // Insert items if provided
        if (items && Array.isArray(items) && items.length > 0) {
            const itemValues = items.map((item, index) => [
                checklistId,
                item.text || item.item_text,
                index
            ]);
            
            await db.query(
                'INSERT INTO checklist_items (checklist_id, item_text, order_index) VALUES ?',
                [itemValues]
            );
        }
        
        res.status(201).json({ 
            success: true, 
            message: 'Checklist created successfully',
            data: { id: checklistId }
        });
    } catch (error) {
        console.error('Error creating checklist:', error);
        res.status(500).json({ success: false, message: 'Failed to create checklist', error: error.message });
    }
};

// Update checklist item completion status
const updateChecklistItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_completed } = req.body;
        
        const completedAt = is_completed ? new Date() : null;
        
        await db.execute(
            'UPDATE checklist_items SET is_completed = ?, completed_at = ? WHERE id = ?',
            [is_completed, completedAt, id]
        );
        
        res.json({ success: true, message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error updating checklist item:', error);
        res.status(500).json({ success: false, message: 'Failed to update item', error: error.message });
    }
};

// Delete a checklist
const deleteChecklist = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        
        let query = 'DELETE FROM test_checklists WHERE id = ?';
        let params = [id];
        
        if (userId) {
            query += ' AND user_id = ?';
            params.push(userId);
        }
        
        const [result] = await db.execute(query, params);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Checklist not found' });
        }
        
        res.json({ success: true, message: 'Checklist deleted successfully' });
    } catch (error) {
        console.error('Error deleting checklist:', error);
        res.status(500).json({ success: false, message: 'Failed to delete checklist', error: error.message });
    }
};

module.exports = {
    getAllChecklists,
    getChecklistById,
    createChecklist,
    updateChecklistItem,
    deleteChecklist
};
