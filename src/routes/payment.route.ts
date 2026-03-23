import express, { Router, Request, Response, NextFunction } from 'express';
import pool from '../db';
import { Profile } from '../types/profile';
import authMiddleware from '../middleware/auth.middleware';


export interface AuthRequest extends Request {
    user?: any;
}

const router = Router();