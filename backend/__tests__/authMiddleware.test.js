const { authenticateJWT } = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');
require('dotenv').config();

describe('authenticateJWT', () => {
  it('should return 401 if no token is provided', () => {
    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    authenticateJWT(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      code: 'UNAUTHORIZED',
      message: 'Token de autenticação não fornecido'
    });
  });

  it('should call next if token is valid', () => {
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    const next = jest.fn();

    authenticateJWT(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
