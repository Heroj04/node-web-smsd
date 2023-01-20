const Router = require('express');
const smsd = require('../../smsd');

const router = Router();

router.get('/incoming', async (req, res) => {
  let results;
  try {
    results = await smsd.getIncoming();
  } catch (error) {
    res.status(500).send({ error });
  }
  res.send(results);
});

router.get('/outgoing', async (req, res) => {
  let results;
  try {
    results = await smsd.getOutgoing();
  } catch (error) {
    res.status(500).send({ error });
  }
  res.send(results);
});

router.get('/sent', async (req, res) => {
  let results;
  try {
    results = await smsd.getSent();
  } catch (error) {
    res.status(500).send({ error });
  }
  res.send(results);
});

router.get('/checked', async (req, res) => {
  let results;
  try {
    results = await smsd.getChecked();
  } catch (error) {
    res.status(500).send({ error });
  }
  res.send(results);
});

router.get('/failed', async (req, res) => {
  let results;
  try {
    results = await smsd.getFailed();
  } catch (error) {
    res.status(500).send({ error });
  }
  res.send(results);
});

module.exports = router;
