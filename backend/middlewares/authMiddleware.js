const jwt = require('jsonwebtoken');
const { pool } = require('../config/dbConfig');
const logger = require('../config/logger');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      code: 'UNAUTHORIZED',
      message: 'Token de autenticação não fornecido'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verificar se o usuário ainda existe no banco
    const [users] = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [decoded.id]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        code: 'USER_NOT_FOUND',
        message: 'Usuário não encontrado'
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    logger.error(`Erro na autenticação: ${error.message}`);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 'TOKEN_EXPIRED',
        message: 'Token expirado'
      });
    }
    
    res.status(401).json({
      code: 'INVALID_TOKEN',
      message: 'Token inválido'
    });
  }
};

module.exports = {
  authenticateJWT
};