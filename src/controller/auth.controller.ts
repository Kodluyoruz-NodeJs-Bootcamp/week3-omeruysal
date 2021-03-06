import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { User } from '../entity/user.entity';
import bcryptjs from 'bcryptjs';
import { RegisterValidation } from '../validation/register.validation';
import { sign, verify } from 'jsonwebtoken';
import { saveUser, getOne, getOneById, update, updatePassword } from '../service/user.service';
declare module 'express-session' {
  interface SessionData {
    browser: string;
  }
}

export const Register = async (req: Request, res: Response) => {
  const body = req.body;

  const { error } = RegisterValidation.validate(body);
  if (error) {
    return res.status(400).send(error.details);
  }

  if (body.password !== body.passwordConfirm) {
    return res.status(400).json({
      message: 'Passwords do not match',
    });
  }
  const { firstName, lastName, email } = body;
  const { password, ...user } = await saveUser(firstName, lastName, email, body.password);
  res.send(user);
};

export const Login = async (
  req: Request<{}, {}, { email: string; password: string; browser: string }, {}>,
  res: Response
) => {
  req.session.browser = req.headers['user-agent'];

  const user = await getOne(req.body.email);

  if (!user || !(await bcryptjs.compare(req.body.password, user.password))) {
    return res.status(404).send({
      message: 'Invalid credentials',
    });
  }

  const payload = {
    id: user.id,
  };
  const token = sign(payload, <string>process.env.SECRET_KEY);
  // We send token in cookie and it makes much secure
  res.cookie('jwt', token, {
    httpOnly: true, // To avoid Xss attacks. No one can reach our cookie with using js
    maxAge: 24 * 60 * 60 * 1000,
  });
  const { password, ...data } = user;
  res.json({
    message: 'success',
  });
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
  const { password, ...user } = req['user'];
  res.send(user);
};

export const Logout = (req: Request, res: Response) => {
  res.cookie('jwt', { maxAge: 0 });

  res.send({
    message: 'success',
  });
};

export const UpdateInfo = async (req: Request, res: Response) => {
  try {
    const user = req['user'];
    await update(parseInt(user.id), req.body);
    const { password, ...data } = await getOneById(parseInt(user.id));
    res.send(data);
  } catch (error) {
    res.status(400);
  }
};

export const UpdatePassword = async (req: Request, res: Response) => {
  try {
    const user = req['user'];
    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(400).json({
        message: 'Passwords do not match',
      });
    }
    await updatePassword(user.id, req.body.password);
    const { password, ...data } = user;
    res.send(data);
  } catch (error) {
    res.status(400);
  }
};
