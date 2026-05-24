const router = require('express').Router();
const GameController = require('../controllers/GameController');

router.get('/',    GameController.list);
router.get('/:id', GameController.detail);

module.exports = router;
