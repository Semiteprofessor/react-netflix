const router = require('express').Router();
const { getAllPosts } = require('../controllers/postControllers');

router.get('/', getAllPosts);

module.exports = router;