const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const logger = require('./config/logger');
const { connectWithRetry } = require('./config/dbConfig'); // Updated import
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const appointmentRoutes = require('./routes/appointments');

// Importação de rotas
const routes = require('./routes/index');

const app = express();

// Configuração básica do Express
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    logger.warn(`Limite de taxa excedido: ${req.ip}`);
    res.status(429).json({
      code: 'RATE_LIMITED',
      message: 'Muitas requisições, tente novamente mais tarde'
    });
  }
});
app.use(limiter);

// Logger de requisições
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  next();
});

// Configuração das rotas
app.use(routes);
app.use('/api', appointmentRoutes);

// Health Check
app.get('/health', async (req, res) => {
  try {
    const pool = await connectWithRetry();
    const [rows] = await pool.query('SELECT 1');
    res.json({
      status: 'OK',
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Health check failed', error);
    res.status(500).json({
      status: 'ERROR',
      database: 'Disconnected'
    });
  }
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  logger.error(`Erro não tratado: ${err.message}`, {
    stack: err.stack,
    path: req.originalUrl,
    method: req.method
  });
  
  res.status(err.statusCode || 500).json({
    code: 'SERVER_ERROR',
    message: 'Erro interno no servidor',
    ...(true && { stack: err.stack })
  });
});

// Inicialização do servidor
const BACKEND_PORT = 5070;

// Alterar ordem de inicialização
const startServer = async () => {
  try {
    logger.info('Iniciando servidor...');
    
    const pool = await connectWithRetry();
    logger.info('Conexão com o banco de dados estabelecida');
    
    app.listen(BACKEND_PORT, () => {
      logger.info(`🚀 Servidor rodando na porta ${BACKEND_PORT}`);
    });
  } catch (error) {
    logger.error('❌ Falha na inicialização:', error);
    process.exit(1);
  }
};

startServer();