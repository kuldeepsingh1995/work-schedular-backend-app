const express = require("express");
const router = express.Router();
const classYearService = require('../../services/class-year.service');

//add on top of all routes
router.get('/export-to-csv', classYearService.exportToCsvFunc);
//add on top of all routes


router.post("/", classYearService.findAll);

// Create a new
router.post('/create', classYearService.create);



// Retrieve a single with id
router.get('/:id', classYearService.findOne);
// Update a with id
router.put('/:id', classYearService.update);
// Delete a with id
router.post('/delete', classYearService.delete);


 
module.exports = router;