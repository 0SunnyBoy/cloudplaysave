const router = require('express').Router();
const OrderController = require('../controllers/OrderController');
const authMiddleware  = require('../middleware/auth');

router.post('/',        authMiddleware, OrderController.checkout);
router.get ('/history', authMiddleware, OrderController.history);

module.exports = router;
