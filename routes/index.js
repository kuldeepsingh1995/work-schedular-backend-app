const express = require("express");
const router = express.Router();
const classYearRoutes = require('./classYearRoutes');
const ClientRoutes = require('./ClientRoutes');





router.use('/class-years', classYearRoutes);
router.use('/client', ClientRoutes);

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

module.exports = router;
