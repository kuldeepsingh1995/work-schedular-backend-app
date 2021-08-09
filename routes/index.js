const express = require("express");
const router = express.Router();
const userRoutes = require('./userRoutes');
const workerRoutes = require('./workerRoutes');
const classYearRoutes = require('./classYearRoutes');
const GeographicalRegionRoutes = require('./geoGraphicalRegionRoutes');
const RestrictionFieldsRoutes = require('./RestrictionFieldsRoutes');
const RestrictionRoutes = require('./RestrictionRoutes');
const ClientRoutes = require('./ClientRoutes');
const DivisionsRoutes = require('./DivisionsRoutes');
const VehicleRoutes = require('./VehicleRoutes');
const schoolBillingInformationRoutes = require('./schoolBillingInformationRoutes');
const fileManagerRoutes = require('./fileManagerRoutes');
const importCsvRoutes = require('./importCsvRoutes');
const userManagerRoutes = require('./userManagerRoutes');





// const conversationRoutes = require('./conversationRoutes');


router.use('/users', userRoutes);
router.use('/workers', workerRoutes);
router.use('/class-years', classYearRoutes);
router.use('/geographical-region', GeographicalRegionRoutes);
router.use('/restriction-fields', RestrictionFieldsRoutes);
router.use('/restriction', RestrictionRoutes);
router.use('/client', ClientRoutes);
router.use('/divisions', DivisionsRoutes);
router.use('/vehicles', VehicleRoutes);
router.use('/school-billing-information', schoolBillingInformationRoutes);
router.use('/file-manager', fileManagerRoutes);
router.use('/user-manager', userManagerRoutes);

router.use('/import-csv', importCsvRoutes);




// router.use('/conversation', conversationRoutes);

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

module.exports = router;