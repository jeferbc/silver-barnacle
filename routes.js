const express = require('express');
const router = express.Router();
const surveys = require('./controllers/surveys');

router.get("/", surveys.index);
router.get("/surveys", surveys.index);
router.get("/surveys/new", surveys.new);
router.post("/surveys", surveys.create);

module.exports = router;
