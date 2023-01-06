const Router = require('express');

const router = Router();

router.get('/incoming', (req, res) => res.send('messages request incoming stub'));

router.get('/outgoing', (req, res) => res.send('messages request outgoing stub'));

router.get('/sent', (req, res) => res.send('messages request sent stub'));

router.get('/checked', (req, res) => res.send('messages request checked stub'));

router.get('/failed', (req, res) => res.send('messages request failed stub'));

module.exports = router;
