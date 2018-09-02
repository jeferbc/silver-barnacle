const express = require('express');
const router = express.Router();
const middlewares = require('./middlewares');
const registrations = require('./controllers/registrations');
const sessions = require('./controllers/sessions');
const surveys = require('./controllers/surveys');

router.use(middlewares.setUser);

router.get("/", surveys.index);

router.get("/register", registrations.new);
router.post("/register", registrations.create);
router.get("/login", sessions.new);
router.post("/login", sessions.create);
router.get("/logout", middlewares.requireUser, sessions.destroy);

router.get("/surveys", surveys.index);
router.get("/surveys/new", middlewares.requireUser, surveys.new);
router.post("/surveys", middlewares.requireUser, surveys.create);
router.get("/surveys/:id", surveys.show)
router.post("/surveys/:id/vote", surveys.vote);
router.get("/surveys/:id/results", surveys.results);

module.exports = router;
