const express = require('express');
const { authController, userController, scheduleController } = require('../controllers');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const logger = require('../config/logger');

const router = express.Router();

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh-token', authController.refreshToken);
router.post('/auth/logout', authenticateJWT, authController.logout);


// Schedule routes
router.post('/schedules', authenticateJWT, scheduleController.createSchedule);
router.put('/schedules/:id', authenticateJWT, scheduleController.updateSchedule);
router.delete('/schedules/:id', authenticateJWT, scheduleController.deleteSchedule);
router.get('/schedules', authenticateJWT, scheduleController.getAllSchedules);
router.get('/schedules/:id', authenticateJWT, scheduleController.getScheduleById);

// User routes
router.get('/users/me', authenticateJWT, userController.getUser);
router.put('/users/me', authenticateJWT, userController.updateUser);
router.delete('/users/me', authenticateJWT, userController.deleteUser);

module.exports = router;
