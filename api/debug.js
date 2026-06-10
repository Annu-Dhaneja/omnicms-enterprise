module.exports = (req, res) => {
  try {
    require('../server.js');
    res.status(200).send("No error!");
  } catch (e) {
    res.status(500).send("ERROR: " + e.message + "\n" + e.stack);
  }
};
