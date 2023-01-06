const Router = require('express');
const routes = require('./routes');

const router = Router();

router.use('/send', routes.send);
router.use('/authentication', routes.authentication);
router.use('/messages', routes.messages);

module.exports = router;
