const express = require('express');
const router = express.Router();
const contractsController = require('../controllers/contractsController');
const { userAuth } = require('../middleware/auth');
const cookieParser = require("cookie-parser");

router.use(cookieParser());

router.post('/',userAuth, contractsController.createContract);
router.get('/', userAuth,contractsController.getContracts);
router.get('/:id', userAuth,contractsController.getContractById);
router.put('/:id', userAuth,contractsController.updateContractById);
router.delete('/:id', userAuth,contractsController.deleteContractById);

module.exports = router;
