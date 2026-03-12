import express, { Request } from 'express';

export interface AuthRequest extends Request {
    user?:any;
}