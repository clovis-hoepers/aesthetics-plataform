const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500, // Limite de requisições
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  },
  handler: (req, res) => {
    logger.warn(`Limite de taxa excedido: ${req.ip} ${req.user?.id || 'anon'}`);
    res.status(429).json({
      code: 'RATE_LIMITED',
      message: 'Muitas requisições, tente novamente mais tarde'
    });
  }
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // Limite de tentativas de login
  message: {
    code: 'LOGIN_LIMITED',
    message: 'Muitas tentativas de login, tente novamente mais tarde'
  }
});

module.exports = {
  apiLimiter,
  authLimiter
};