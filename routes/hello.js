const express = require('express');

const helloController = require('../controllers/hello');

const router = express.Router();

router.get('/hello', helloController.getHelloMessage);

module.exports = router;