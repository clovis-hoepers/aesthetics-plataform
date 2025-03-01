const express = require('express');
const { createAppointment } = require('../controllers/appointments');
const { appointmentSchema } = require('../utils/validationSchemas');

const router = express.Router();

router.post('/appointments', appointmentSchema, createAppointment);

module.exports = router;
