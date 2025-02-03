

const express = require('express');
const {getNotes, getNotesbyQuery} = require('../controllers/fetchNotesController')

const router = express.Router();


router.get('/getNotes', getNotes);
router.get('/notes', getNotesbyQuery);


module.exports = router;