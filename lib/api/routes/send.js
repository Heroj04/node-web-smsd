const Router = require('express');
const jsonParser = require('body-parser').json({ Type: ['application/json', 'text/plain'] });
const smsd = require('../../smsd');

const router = Router();

router.post('/', jsonParser, async (req, res) => {
  try {
    await smsd.send(req.body.to, req.body.message);
    res.send({ status: 'ok' });
  } catch (error) {
    res.status(500).send({ status: 'error', error });
  }
});

module.exports = router;
