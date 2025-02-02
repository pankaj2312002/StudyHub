const express = require('express');
const {toggleLike} = require('../controllers/like&unlikeController')
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/toggle-like/:id', authMiddleware, toggleLike);

module.exports = router;
