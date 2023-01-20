const Router = require('express');
const smsd = require('../../smsd');

const router = Router();

router.post('/', async (req, res) => {
  try {
    await smsd.send(req.body.to, req.body.message);
  } catch (error) {
    res.status(500).send({ status: 'error', error });
  }
  res.send({ status: 'ok' });
});

module.exports = router;
