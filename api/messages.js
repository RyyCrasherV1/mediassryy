const store = require('./_store');
module.exports = (req, res) => {
  res.setHeader('Content-Type','application/json');
  // return latest messages (not deleted)
  const out = store.messages.filter(m=>!m.deleted).slice(-500);
  res.status(200).send(JSON.stringify(out));
};
