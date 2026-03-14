import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import User from '../models/userModel';

interface JwtPayload {
  _id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: { _id: string };
    }
  }
}

const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ error: 'You must be logged in' });
    return;
  }

  const token = authorization.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const { _id } = jwt.verify(token, secret) as JwtPayload;
    const user = await User.findById(_id).select('_id');

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.user = { _id: (user._id as Types.ObjectId).toString() };
    next();
  } catch {
    res.status(401).json({ error: 'You must be logged in' });
  }
};

export default requireAuth;
