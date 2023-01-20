const Router = require('express');
const smsd = require('../../smsd');

const router = Router();

router.get('/incoming', async (req, res) => {
  let results;
  try {
    results = await smsd.getIncoming();
    res.send(results);
  } catch (error) {
    res.status(500).send({ status: 'error', error });
  }
});

router.get('/outgoing', async (req, res) => {
  let results;
  try {
    results = await smsd.getOutgoing();
    res.send(results);
  } catch (error) {
    res.status(500).send({ status: 'error', error });
  }
});

router.get('/sent', async (req, res) => {
  let results;
  try {
    results = await smsd.getSent();
    res.send(results);
  } catch (error) {
    res.status(500).send({ status: 'error', error });
  }
});

router.get('/checked', async (req, res) => {
  let results;
  try {
    results = await smsd.getChecked();
    res.send(results);
  } catch (error) {
    res.status(500).send({ status: 'error', error });
  }
});

router.get('/failed', async (req, res) => {
  let results;
  try {
    results = await smsd.getFailed();
    res.send(results);
  } catch (error) {
    res.status(500).send({ status: 'error', error });
  }
});

module.exports = router;
