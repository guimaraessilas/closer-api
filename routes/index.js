var express = require('express');
var router = express();

var db = require('../queries');

router.get('/users', db.listUsers);
router.post('/users', db.createUser);
router.put('/users', db.updateUser);
router.get('/users/:search', db.findUser);
router.get('/users/find/:email', db.findUserByEmail);
router.post('/login', db.login);

module.exports = router;