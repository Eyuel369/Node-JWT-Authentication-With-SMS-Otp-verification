const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
const machineryController = require('../controllers/machineryController');
const { userAuth } = require('../middleware/auth');

router.use(cookieParser());

// Create a new machinery
router.post('/',userAuth, machineryController.createMachinery);

// Get all machinery
router.get('/', machineryController.getMachinery);

// Get all machinery
router.get('/:id', machineryController.ownerMachinery);

// Update a machinery by ID
router.put('/:id',userAuth, machineryController.updateMachinery);

// Delete a machinery by ID
router.delete('/:id',userAuth, machineryController.deleteMachinery);

module.exports = router;
