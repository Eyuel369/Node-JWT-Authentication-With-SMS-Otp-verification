const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
const farmController = require('../controllers/farmController');
const { userAuth } = require('../middleware/auth');

router.use(cookieParser());

// Save a farm to db
router.post('/',userAuth, farmController.createFarm);

// Fetch a farm by Owner ID
router.get('/:id', farmController.getFarmById);

// Update a farm by ID
router.put('/:id',userAuth, farmController.updateFarm);

// Delete a farm by ID
router.delete('/:id',userAuth, farmController.deleteFarm);

module.exports = router;
