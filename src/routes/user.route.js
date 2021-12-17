const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const verifyToken = require('../middleware/verifyToken')

router.get('/get-user', verifyToken, userController.getUser); //getuser avec le middleware

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);
router.get('/', userController.getAll);
router.get('/:id', userController.getId);

module.exports = router;