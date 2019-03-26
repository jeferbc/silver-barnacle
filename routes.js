const express = require('express');
const router = express.Router();
const middlewares = require('./middlewares');
const registrations = require('./controllers/registrations');
const sessions = require('./controllers/sessions');
const polls = require('./controllers/polls');

router.use(middlewares.setUser);

router.get("/", polls.index);

router.get("/register", registrations.new);
router.post("/register", registrations.create);
router.get("/login", sessions.new);
router.post("/login", sessions.create);
router.get("/logout", middlewares.requireUser, sessions.destroy);

router.get("/polls", polls.index);
router.get("/polls/new", middlewares.requireUser, polls.new);
router.post("/polls", middlewares.requireUser, polls.create);
router.get("/polls/:id", polls.show);
router.post("/polls/:id/vote", polls.vote);
router.get("/polls/:id/results", polls.results);
router.delete("/polls/:id", polls.remove);

module.exports = router;
