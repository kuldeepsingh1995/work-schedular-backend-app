const express = require("express");
const router = express.Router();
const clientService = require('../../services/client.service');

//add on top of all routes
router.get('/export-to-csv', clientService.exportToCsvFunc);
//add on top of all routes


router.post("/", clientService.findAll);

// Create a new
router.post('/create', clientService.create);



// Retrieve a single with id
router.get('/:id', clientService.findOne);
// Update a with id
router.put('/:id', clientService.update);
// Delete a with id
router.post('/delete', clientService.delete);
 
module.exports = router;