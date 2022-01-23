import { Router } from 'express';
import { AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from '../controller/auth.controller';
import { Users } from '../controller/user.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

export const routes = (router: Router) => {
  router.get('/', (req, res) => {
    res.status(200).json({
      message: 'health check',
    });
  });
  router.post('/api/register', Register); // Register
  router.post('/api/login', Login); //Login
  router.get('/api/user', AuthMiddleware, AuthenticatedUser); //Getting logged in user
  router.post('/api/logout', AuthMiddleware, Logout); //Logout
  router.put('/api/user/info', AuthMiddleware, UpdateInfo); //Update fields except password
  router.put('/api/user/password', AuthMiddleware, UpdatePassword); //Update only password
  router.get('/api/users', AuthMiddleware, Users); //Get all users
};
