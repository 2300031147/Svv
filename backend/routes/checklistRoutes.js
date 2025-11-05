const express = require('express');
const router = express.Router();
const checklistController = require('../controllers/checklistController');
const authMiddleware = require('../auth/authMiddleware');

// Optional authentication middleware - allows both authenticated and guest users
const optionalAuth = (req, res, next) => {
    authMiddleware.optionalAuth(req, res, next);
};

// Get all checklists
router.get('/checklists', optionalAuth, checklistController.getAllChecklists);

// Get single checklist
router.get('/checklists/:id', optionalAuth, checklistController.getChecklistById);

// Create new checklist
router.post('/checklists', optionalAuth, checklistController.createChecklist);

// Update checklist item
router.put('/checklists/items/:id', optionalAuth, checklistController.updateChecklistItem);

// Delete checklist
router.delete('/checklists/:id', optionalAuth, checklistController.deleteChecklist);

module.exports = router;
