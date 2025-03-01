const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const crypto = require('crypto');
const { pool } = require('../config/dbConfig');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
      sessionId: crypto.randomUUID()
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
      hash: crypto.createHash('sha256').update(user.password || '').digest('hex')
    },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

const authController = {
  register: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validação de registro falhou', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;

      // Verificar usuário existente
      const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        logger.warn(`Tentativa de registro com email existente: ${email}`);
        return res.status(409).json({ 
          code: 'EMAIL_EXISTS',
          message: 'Este email já está registrado'
        });
      }

      // Criar usuário
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const role = email === 'seu_nome@email.com' ? 'seu_nome' : 'user';
      const [result] = await pool.query('INSERT INTO users (name, email, password, salt, role) VALUES (?, ?, ?, ?, ?)', [name, email, hashedPassword, salt, role]);
      const user = { id: result.insertId, name, email, role };

      // Gerar tokens
      const { accessToken, refreshToken } = generateTokens(user);

      // Log de auditoria
      logger.info(`Novo usuário registrado: ${email}`, { 
        userId: user.id,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Configurar cookie seguro
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
      });

      res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        accessToken
      });

    } catch (error) {
      logger.error(`Erro no registro: ${error.message}`, { 
        stack: error.stack,
        body: req.body
      });
      res.status(500).json({
        code: 'SERVER_ERROR',
        message: 'Erro interno no servidor'
      });
    }
  },

  login: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validação de login falhou', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Buscar usuário
      const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length === 0) {
        logger.warn(`Tentativa de login com email não registrado: ${email}`);
        return res.status(401).json({
          code: 'INVALID_CREDENTIALS',
          message: 'Credenciais inválidas'
        });
      }

      const user = users[0];

      // Verificar senha
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        logger.warn(`Tentativa de login com senha inválida para: ${email}`);
        return res.status(401).json({
          code: 'INVALID_CREDENTIALS',
          message: 'Credenciais inválidas'
        });
      }

      // Gerar tokens
      const { accessToken, refreshToken } = generateTokens(user);

      // Log de acesso
      logger.info(`Login bem-sucedido: ${email}`, {
        userId: user.id,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Atualizar cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        accessToken
      });

    } catch (error) {
      logger.error(`Erro no login: ${error.message}`, {
        stack: error.stack,
        body: req.body
      });
      res.status(500).json({
        code: 'SERVER_ERROR',
        message: 'Erro interno no servidor'
      });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        logger.warn('Tentativa de refresh sem token');
        return res.status(401).json({
          code: 'UNAUTHORIZED',
          message: 'Token de refresh necessário'
        });
      }

      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
      const user = users[0];

      if (!user || decoded.hash !== crypto.createHash('sha256').update(user.password).digest('hex')) {
        logger.warn('Tentativa de refresh com token inválido');
        return res.status(401).json({
          code: 'INVALID_TOKEN',
          message: 'Token de refresh inválido'
        });
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      logger.info(`Token renovado para usuário: ${user.email}`);

      res.json({ accessToken });

    } catch (error) {
      logger.error(`Erro ao renovar token: ${error.message}`);
      res.status(401).json({
        code: 'INVALID_TOKEN',
        message: 'Token expirado ou inválido'
      });
    }
  },

  logout: (req, res) => {
    res.clearCookie('refreshToken');
    logger.info(`Usuário deslogado: ${req.user.email}`);
    res.status(204).end();
  }
};

const scheduleController = {
  createSchedule: async (req, res) => {
    try {
      const { client_id, service_type, scheduled_at, notes } = req.body;
      
      const [result] = await pool.query(
        `INSERT INTO schedules 
        (user_id, client_id, service_type, scheduled_at, notes) 
        VALUES (?, ?, ?, ?, ?)`,
        [req.user.id, client_id, service_type, scheduled_at, notes]
      );

      const [newSchedule] = await pool.query(
        `SELECT s.*, c.name as client_name 
        FROM schedules s
        JOIN clients c ON s.client_id = c.id
        WHERE s.id = ?`,
        [result.insertId]
      );

      logger.info(`Novo agendamento criado: ${result.insertId}`);
      res.status(201).json(newSchedule[0]);
    } catch (error) {
      logger.error(`Erro ao criar agendamento: ${error.message}`);
      res.status(500).json({ 
        code: 'SCHEDULE_CREATION_ERROR',
        message: 'Erro ao criar agendamento' 
      });
    }
  },

  getAllSchedules: async (req, res) => {
    try {
      const [schedules] = await pool.query(
        `SELECT s.*, c.name as client_name 
        FROM schedules s
        JOIN clients c ON s.client_id = c.id`
      );

      res.json(schedules);
    } catch (error) {
      logger.error(`Erro ao buscar agendamentos: ${error.message}`);
      res.status(500).json({ 
        code: 'SCHEDULE_FETCH_ERROR',
        message: 'Erro ao buscar agendamentos' 
      });
    }
  },

  getScheduleById: async (req, res) => {
    try {
      const { id } = req.params;
      const [schedules] = await pool.query(
        `SELECT s.*, c.name as client_name 
        FROM schedules s
        JOIN clients c ON s.client_id = c.id
        WHERE s.id = ?`,
        [id]
      );

      if (schedules.length === 0) {
        return res.status(404).json({ 
          code: 'SCHEDULE_NOT_FOUND',
          message: 'Agendamento não encontrado' 
        });
      }

      res.json(schedules[0]);
    } catch (error) {
      logger.error(`Erro ao buscar agendamento: ${error.message}`);
      res.status(500).json({ 
        code: 'SCHEDULE_FETCH_ERROR',
        message: 'Erro ao buscar agendamento' 
      });
    }
  },

  updateSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const { client_id, service_type, scheduled_at, notes } = req.body;

      await pool.query(
        `UPDATE schedules 
        SET client_id = ?, service_type = ?, scheduled_at = ?, notes = ? 
        WHERE id = ?`,
        [client_id, service_type, scheduled_at, notes, id]
      );

      const [updatedSchedule] = await pool.query(
        `SELECT s.*, c.name as client_name 
        FROM schedules s
        JOIN clients c ON s.client_id = c.id
        WHERE s.id = ?`,
        [id]
      );

      logger.info(`Agendamento atualizado: ${id}`);
      res.json(updatedSchedule[0]);
    } catch (error) {
      logger.error(`Erro ao atualizar agendamento: ${error.message}`);
      res.status(500).json({ 
        code: 'SCHEDULE_UPDATE_ERROR',
        message: 'Erro ao atualizar agendamento' 
      });
    }
  },

  deleteSchedule: async (req, res) => {
    try {
      const { id } = req.params;

      await pool.query(
        `DELETE FROM schedules WHERE id = ?`,
        [id]
      );

      logger.info(`Agendamento deletado: ${id}`);
      res.status(204).end();
    } catch (error) {
      logger.error(`Erro ao deletar agendamento: ${error.message}`);
      res.status(500).json({ 
        code: 'SCHEDULE_DELETE_ERROR',
        message: 'Erro ao deletar agendamento' 
      });
    }
  }
};

const userController = {
  getUser: async (req, res) => {
    try {
      const { id } = req.user;

      const [users] = await pool.query(
        `SELECT id, name, email, role 
        FROM users 
        WHERE id = ?`,
        [id]
      );

      if (users.length === 0) {
        return res.status(404).json({ 
          code: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado' 
        });
      }

      res.json(users[0]);
    } catch (error) {
      logger.error(`Erro ao buscar usuário: ${error.message}`);
      res.status(500).json({ 
        code: 'USER_FETCH_ERROR',
        message: 'Erro ao buscar usuário' 
      });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.user;
      const { name, email, password } = req.body;

      const updates = [];
      const values = [];

      if (name) {
        updates.push('name = ?');
        values.push(name);
      }

      if (email) {
        updates.push('email = ?');
        values.push(email);
      }

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updates.push('password = ?');
        values.push(hashedPassword);
      }

      values.push(id);

      await pool.query(
        `UPDATE users 
        SET ${updates.join(', ')} 
        WHERE id = ?`,
        values
      );

      const [updatedUser] = await pool.query(
        `SELECT id, name, email, role 
        FROM users 
        WHERE id = ?`,
        [id]
      );

      logger.info(`Usuário atualizado: ${id}`);
      res.json(updatedUser[0]);
    } catch (error) {
      logger.error(`Erro ao atualizar usuário: ${error.message}`);
      res.status(500).json({ 
        code: 'USER_UPDATE_ERROR',
        message: 'Erro ao atualizar usuário' 
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.user;

      await pool.query(
        `DELETE FROM users WHERE id = ?`,
        [id]
      );

      logger.info(`Usuário deletado: ${id}`);
      res.status(204).end();
    } catch (error) {
      logger.error(`Erro ao deletar usuário: ${error.message}`);
      res.status(500).json({ 
        code: 'USER_DELETE_ERROR',
        message: 'Erro ao deletar usuário' 
      });
    }
  }
};

module.exports = {
  authController,
  userController,
  scheduleController
};
